// lib/google-sheets.js
import { google } from "googleapis";

/**
 * Resolve env by supporting multiple possible names and throwing if missing.
 * preferNames: array of env names to try in order.
 */
function resolveEnv(preferNames) {
  for (const n of preferNames) {
    const v = process.env[n];
    if (v) return v;
  }
  return null;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/**
 * Return an authorized google.sheets client and normalized config.
 * Throws descriptive errors if something is missing or invalid.
 */
export async function getSheetsClient() {
  // support multiple environment variable names — this makes the helper robust.
  const clientEmail = resolveEnv(["GOOGLE_CLIENT_EMAIL", "GOOGLE_SERVICE_ACCOUNT_EMAIL"]);
  const rawPrivateKey = resolveEnv(["GOOGLE_PRIVATE_KEY", "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY"]);
  const spreadsheetId = resolveEnv(["GOOGLE_SHEET_ID", "GOOGLE_SHEETS_SPREADSHEET_ID"]);
  const sheetTitle = process.env.GOOGLE_SHEETS_SHEET_TITLE || process.env.GOOGLE_SHEET_TITLE || "Bookings";

  // Basic checks
  assert(clientEmail, "Missing Google service account email. Set GOOGLE_CLIENT_EMAIL or GOOGLE_SERVICE_ACCOUNT_EMAIL.");
  assert(rawPrivateKey, "Missing Google private key. Set GOOGLE_PRIVATE_KEY or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.");
  assert(spreadsheetId, "Missing Google Sheet ID. Set GOOGLE_SHEET_ID or GOOGLE_SHEETS_SPREADSHEET_ID.");

  // Normalize private key (support both multiline and \n-escaped)
  const privateKey = rawPrivateKey.includes("\\n") ? rawPrivateKey.replace(/\\n/g, "\n") : rawPrivateKey;

  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    // give a helpful hint rather than a cryptic OpenSSL error
    throw new Error("GOOGLE_PRIVATE_KEY does not look like a PEM private key. Make sure you pasted the full key and didn't add extra quotes.");
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // authorize to fail early with a clear error
    await new Promise((resolve, reject) => {
      auth.authorize((err /*, tokens */) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const sheets = google.sheets({ version: "v4", auth });
    return { sheets, spreadsheetId, sheetTitle };
  } catch (err) {
    // Keep the message clear for logs; don't leak full secrets.
    console.error("Google Sheets client initialization error:", (err && err.message) || err);
    throw new Error(`Failed to initialize Google Sheets client: ${err && err.message ? err.message : String(err)}`);
  }
}

/**
 * Ensure the tab (sheetTitle) exists and has a header row.
 * client should be the object returned from getSheetsClient().
 */
export async function ensureSheetAndHeader(client) {
  const { sheets, spreadsheetId, sheetTitle } = client;
  assert(sheets, "sheets client missing in ensureSheetAndHeader");
  assert(spreadsheetId, "spreadsheetId missing in ensureSheetAndHeader");

  // fetch spreadsheet metadata
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existingSheets = meta?.data?.sheets || [];

  const exists = existingSheets.some((s) => (s?.properties?.title || "") === sheetTitle);

  if (!exists) {
    // create sheet/tab
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetTitle,
                gridProperties: { frozenRowCount: 1 },
              },
            },
          },
        ],
      },
    });

    // write header row (A1)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            "Timestamp",
            "Name",
            "Phone",
            "Email",
            "Venue",
            "Court",
            "Date",
            "Time Slot",
            "Duration (hrs)",
            "Total Amount",
            "Advance Amount",
            "Remaining Amount",
            "Payment Method",
            "Payment Meta",
            // add more columns here if you need
          ],
        ],
      },
    });
  }
}

/**
 * Append a booking row to the configured sheet.
 * rowObj fields (all optional except spreadsheet mapping fields):
 * {
 *   timestampISO, name, phone, email, venue, date, timeSlot,
 *   durationHours, totalAmount, advanceAmount, remainingAmount,
 *   paymentMethod, paymentMeta
 * }
 */
export async function appendBookingRow(rowObj = {}) {
  const client = await getSheetsClient();
  await ensureSheetAndHeader(client);

  const { sheets, spreadsheetId, sheetTitle } = client;

  const {
    timestampISO = new Date().toISOString(),
    name = "",
    phone = "",
    email = "",
    venue = "",
    court = "Court 1",
    date = "",
    timeSlot = "",
    durationHours = "",
    totalAmount = "",
    advanceAmount = "",
    remainingAmount = "",
    paymentMethod = "",
    paymentMeta = "",
  } = rowObj;

  const values = [
    [
      timestampISO,
      name,
      phone,
      email,
      venue,
      court,
      date,
      timeSlot,
      durationHours,
      totalAmount,
      advanceAmount,
      remainingAmount,
      paymentMethod,
      typeof paymentMeta === "string" ? paymentMeta : JSON.stringify(paymentMeta || {}),
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}!A2`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });
    return { ok: true };
  } catch (err) {
    console.error("Failed to append booking row to Google Sheet:", (err && err.message) || err);
    throw new Error(`Failed to append booking to sheet: ${err && err.message ? err.message : String(err)}`);
  }
}

/**
 * Read and return all data rows (A2:Z) from the sheet.
 * Returns array of arrays (rows). If no rows found, returns [].
 */
export async function getAllBookingRows() {
  const client = await getSheetsClient();
  const { sheets, spreadsheetId, sheetTitle } = client;

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTitle}!A2:Z`,
    });
    const rows = res?.data?.values || [];
    return rows;
  } catch (err) {
    console.error("Failed to read booking rows from Google Sheet:", (err && err.message) || err);
    throw new Error(`Failed to read bookings from sheet: ${err && err.message ? err.message : String(err)}`);
  }
}

/**
 * Returns blocked slot array (unique) for a given turfId (or turfName substring) and date (YYYY-MM-DD).
 * - turfId: a short id string you store in the 'Venue' column OR part of venue name to match
 * - date: "YYYY-MM-DD"
 *
 * The function expects Time Slot column to contain comma-separated times (e.g. "06:00, 07:00")
 *
 * NOTE: If your sheet columns differ, update VENUE_COL / DATE_COL / TIMESLOT_COL indexes below (0-based).
 */
export async function getBlockedSlotsFor(turfIdOrName, date, court) {
  if (!turfIdOrName || !date) return [];

  const rows = await getAllBookingRows();

  // Column indexes (0-based) - adjust if your sheet layout is different:
  const VENUE_COL = 4; // E
  const COURT_COL = 5; // F
  const DATE_COL = 6; // G
  const TIMESLOT_COL = 7; // H

  const lowerTarget = String(turfIdOrName).toLowerCase();

  const booked = rows
    .filter((r) => {
      const venueCell = (r[VENUE_COL] || "").toString().trim().toLowerCase();
      const courtCell = (r[COURT_COL] || "court 1").toString().trim().toLowerCase();
      const bookingDate = (r[DATE_COL] || "").toString().trim();
      if (!bookingDate) return false;

      return (
    bookingDate === date &&
    (venueCell.includes(lowerTarget) || lowerTarget.includes(venueCell)) &&
    courtCell === court.toLowerCase()
  );

      // return bookingDate === date && (venueCell.includes(lowerTarget) || lowerTarget.includes(venueCell));
    })
    .flatMap((r) => {
      const ts = (r[TIMESLOT_COL] || "").toString();
      return ts
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    });

  // deduplicate and return
  return Array.from(new Set(booked));
}
