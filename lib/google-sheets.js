 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { google } from "googleapis"

function getEnv(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env: ${name}`)
  return v
}

// Returns an authenticated sheets client and normalized config.
export function getSheetsClient() {
  const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL")
  const privateKeyRaw = getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY")
  // Handle both with and without literal \n
  const privateKey = privateKeyRaw.includes("\\n") ? privateKeyRaw.replace(/\\n/g, "\n") : privateKeyRaw

  const spreadsheetId = getEnv("GOOGLE_SHEETS_SPREADSHEET_ID")
  const sheetTitle = process.env.GOOGLE_SHEETS_SHEET_TITLE || "Bookings"

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })
  return { sheets, spreadsheetId, sheetTitle }
}

// Ensures a sheet tab exists; if not, creates it and writes header row.
export async function ensureSheetAndHeader(client) {
  const { sheets, spreadsheetId, sheetTitle } = client

  const meta = await sheets.spreadsheets.get({ spreadsheetId })
  const exists = _optionalChain([meta, 'access', _ => _.data, 'access', _2 => _2.sheets, 'optionalAccess', _3 => _3.some, 'call', _4 => _4((s) => _optionalChain([s, 'access', _5 => _5.properties, 'optionalAccess', _6 => _6.title]) === sheetTitle)])

  if (!exists) {
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
    })

    // Write header
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
            "Date",
            "Time Slot",
            "Duration (hrs)",
            "Total Amount",
            "Notes",
          ],
        ],
      },
    })
  }
}

// Appends a single row to the configured sheet.
export async function appendBookingRow({
  timestampISO,
  name,
  phone,
  email,
  venue,
  date,
  timeSlot,
  durationHours,
  totalAmount,
  notes,
}










) {
  const client = getSheetsClient()
  await ensureSheetAndHeader(client)

  const { sheets, spreadsheetId, sheetTitle } = client

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetTitle}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [timestampISO, name, phone, email, venue, date, timeSlot, _nullishCoalesce(durationHours, () => ( "")), _nullishCoalesce(totalAmount, () => ( "")), _nullishCoalesce(notes, () => ( ""))],
      ],
    },
  })
}
