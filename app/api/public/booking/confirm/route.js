// // app/api/public/booking/confirm/route.js
// import { NextResponse } from "next/server";
// // import { getSheetsClient } from "@/lib/google-sheets";
// import { appendBookingRow } from "@/lib/google-sheets";
// import { store, turfOwners } from "@/lib/store";

// /** Convert "06:00" -> "06:00-07:00" for in-memory block representation */
// function timeToRange(hourHHMM) {
//   const [hStr, mStr] = hourHHMM.split(":").map((v) => v || "0");
//   const h = Number(hStr);
//   const m = Number(mStr || 0);
//   const endH = (h + 1) % 24;
//   return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}-${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
// }

// /** Normalize many common time formats to "HH:MM" 24-hour string, or null if unparseable */
// function normalizeTimeToHHMM(raw) {
//   if (raw === undefined || raw === null) return null;
//   let s = String(raw).trim();
//   if (!s) return null;

//   // unify separators and remove extra whitespace
//   s = s.replace(/\s+/g, " ").replace(/\./g, ":").toLowerCase();

//   // match "h", "hh", "h:mm", "hh:mm", optionally with am/pm
//   const ampmMatch = s.match(/^(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?$/i);
//   if (ampmMatch) {
//     let hour = parseInt(ampmMatch[1], 10);
//     let minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
//     const ampm = ampmMatch[3] ? ampmMatch[3].toLowerCase() : null;

//     if (ampm === "pm" && hour !== 12) hour += 12;
//     if (ampm === "am" && hour === 12) hour = 0;

//     if (Number.isNaN(hour) || hour < 0 || hour > 23) return null;
//     if (Number.isNaN(minutes) || minutes < 0 || minutes > 59) minutes = 0;
//     return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
//   }

//   // match "hh:mm" or "h:mm"
//   const hm = s.match(/^(\d{1,2}):(\d{2})$/);
//   if (hm) {
//     let hh = parseInt(hm[1], 10);
//     let mm = parseInt(hm[2], 10);
//     if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
//     return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
//   }

//   // match "0700" or "700"
//   const digits = s.match(/^(\d{3,4})$/);
//   if (digits) {
//     const d = digits[1];
//     const hh = d.length === 3 ? parseInt(d.slice(0, 1), 10) : parseInt(d.slice(0, 2), 10);
//     const mm = d.length === 3 ? parseInt(d.slice(1), 10) : parseInt(d.slice(2), 10);
//     if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
//     if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
//     return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
//   }

//   return null;
// }

// /** Helper: given a cell that may contain multiple times, return normalized HH:MM array */
// function extractTimesFromCell(cellValue) {
//   if (!cellValue) return [];
//   // split by comma/semicolon/pipe/newline
//   const parts = String(cellValue).split(/[,;|\n]/).map((p) => p.trim()).filter(Boolean);
//   const out = [];
//   for (const p of parts) {
//     const norm = normalizeTimeToHHMM(p) || p.trim();
//     if (norm) out.push(norm);
//   }
//   return out;
// }

// export async function POST(req) {
//   try {
//     console.log("🟢 /api/public/booking/confirm called (Google Sheets)");

//     // parse body safely
//     let body;
//     try {
//       body = await req.json();
//     } catch (e) {
//       console.warn("Invalid JSON body:", e);
//       return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
//     }

//     const {
//       name, phone, email,
//       totalAmount, advanceAmount, remainingAmount,
//       turfId, turfName, location, city, sport,
//       date, timeSlots = [],
//       court,
//       paymentMethod, paymentMeta = {},
//     } = body || {};

//     if (!turfId || !date || !Array.isArray(timeSlots) || timeSlots.length === 0) {
//       return NextResponse.json({ ok: false, error: "Missing turfId, date or timeSlots" }, { status: 400 });
//     }
//     // --- Server-side: reject booking if any slot is within 30 minutes or already passed ---
// // tzOffsetMinutes should be supplied from client (minutes to add to local to get UTC).
// const tzOffsetMinutes = Number(body.tzOffsetMinutes ?? 0);

// const normCourt =
//   court !== undefined && court !== null
//     ? String(court).replace(/court\s*/i, "").trim()
//     : "1";

// function slotEpochUtc(dateYYYYMMDD, timeHHMM, clientTzOffsetMinutes) {
//   const [y, m, d] = dateYYYYMMDD.split("-").map(Number);
//   const [hh, mm] = timeHHMM.split(":").map(Number);
//   // Date.UTC generates a UTC timestamp for the numbers interpreted as local time components.
//   // To convert client-local time to UTC epoch: take Date.UTC(...) and subtract client offset (in ms).
//   // Explanation: client local time + (offset minutes) -> UTC. So we subtract offset from the constructed local moment.
//   const slotUtcMs = Date.UTC(y, m - 1, d, hh, mm) - (clientTzOffsetMinutes * 60 * 1000);
//   return slotUtcMs;
// }

// const nowUtc = Date.now();
// const thresholdMs = 30 * 60 * 1000;

// const lateSlots = (timeSlots || []).filter((t) => {
//   try {
//     const slotUtcMs = slotEpochUtc(date, t, tzOffsetMinutes);
//     return (slotUtcMs - nowUtc) <= thresholdMs;
//   } catch (e) {
//     return false; // on parse errors, don't mark late here (sheet check will still block)
//   }
// });

// if (lateSlots.length > 0) {
//   console.warn("Rejecting booking because slots are too close/past:", lateSlots);
//   return NextResponse.json(
//     { ok: false, error: "Some time slots are too close or already passed", conflicts: lateSlots },
//     { status: 400 }
//   );
// }


//     // initialize sheets client
//     // (inside your route handler)
// let client;
// try {
//   client = await getSheetsClient();
//   if (!client || !client.sheets || !client.spreadsheetId) {
//     console.error("Google sheets client invalid:", client);
//     return NextResponse.json({ ok: false, error: "Google Sheets client not configured" }, { status: 500 });
//   }
// } catch (err) {
//   console.error("Failed to init sheets client:", err);
//   return NextResponse.json({ ok: false, error: "Failed to initialize Google Sheets client" }, { status: 500 });
// }


//     if (!client?.sheets || !client.spreadsheetId) {
//       console.error("❌ getSheetsClient returned incomplete client:", client);
//       return NextResponse.json({ ok: false, error: "Google Sheets client invalid" }, { status: 500 });
//     }

//     const { sheets, spreadsheetId, sheetTitle } = client;

//     // Read the sheet header + rows
//     const readRange = `${sheetTitle}!A1:Z`;
//     let rows = [];
//     try {
//       const readRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: readRange });
//       rows = readRes?.data?.values || [];
//     } catch (err) {
//       console.error("❌ Google Sheets read failed:", err?.message || err);
//       return NextResponse.json({ ok: false, error: "Failed to read bookings sheet" }, { status: 500 });
//     }

//     if (!rows || rows.length === 0) {
//       // No header/rows -> OK to append (but still continue)
//       rows = [];
//     }

//     // Try to detect header indices (case-insensitive)
//     const header = rows[0] ? rows[0].map((c) => (c || "").toString().trim().toLowerCase()) : [];
//     const venueIdx = header.findIndex((h) => ["turf", "turfid", "turf_id", "venue", "venue_name", "venue name", "slug"].includes(h));
//     const dateIdx = header.findIndex((h) => ["date", "bookingdate", "booking date"].includes(h));
//     const timeIdx = header.findIndex((h) => ["time", "timeslot", "time slot", "slot", "slots"].includes(h));
//     const courtIdx = header.findIndex((h) => ["court", "court number", "court_no", "court no"].includes(h)
// );


//     // sensible fallbacks (0-based indices)
//     const VENUE_COL = venueIdx >= 0 ? venueIdx : 4; // fallback to column E (index 4)
//     const COURT_COL = courtIdx >= 0 ? courtIdx : 5; // fallback to column F
//     const DATE_COL = dateIdx >= 0 ? dateIdx : 6; // fallback to column F (index 5)
//     const TIMESLOT_COL = timeIdx >= 0 ? timeIdx : 7; // fallback to column G (index 6)

//     // build list of existing booked times for this turf + date
//     // iterate rows starting after header (if header exists)
//     const startRow = header.length ? 1 : 0;
//     const existingSlots = [];

//     for (let i = startRow; i < rows.length; i++) {
//       const venueCell = (r[VENUE_COL] || "").toString().trim().toLowerCase();
// const courtCell = (r[COURT_COL] || "").toString().trim();
// const dateCell = (r[DATE_COL] || "").toString().trim();
// const timesCell = r[TIMESLOT_COL] || "";

// if (!venueCell || !dateCell || !timesCell) continue;

// const turfLower = turfId.toString().toLowerCase();
// const turfNameLower = (turfName || "").toString().toLowerCase();

// const matchVenue =
//   venueCell.includes(turfLower) ||
//   (turfNameLower && venueCell.includes(turfNameLower));

// if (!matchVenue) continue;
// if (dateCell !== date) continue;
// if (String(courtCell) !== normalizedCourt) continue; // ✅ COURT FILTER

//     }

//     // normalize incoming timeSlots (the ones user selected) to same format
//     const normalizedRequested = timeSlots
//       .map((t) => normalizeTimeToHHMM(t) || String(t).trim())
//       .filter(Boolean);

//     // normalize existing slots array
//     const normalizedExisting = existingSlots.map((s) => normalizeTimeToHHMM(s) || String(s).trim());

//     // find conflicts (exact match on normalized strings)
//     const conflicts = normalizedRequested.filter((t) => normalizedExisting.includes(t));

//     if (conflicts.length > 0) {
//       console.warn("⚠️ Booking conflict detected:", conflicts, { turfId, date });
//       return NextResponse.json({ ok: false, error: "Some slots already booked", conflicts }, { status: 409 });
//     }

//     // Prepare append row (normalize times to HH:MM format when possible)
//     const normTimesForWrite = normalizedRequested.map((t) => t).join(", ");

//     const timestampISO = new Date().toISOString();
//     const appendValues = [
//       [
//         timestampISO,
//         name || "",
//         phone || "",
//         email || "",
//         turfId,
//         normCourt,
//         date,
//         normTimesForWrite,
//         typeof totalAmount === "number" ? totalAmount : totalAmount || "",
//         typeof advanceAmount === "number" ? advanceAmount : advanceAmount || "",
//         typeof remainingAmount === "number" ? remainingAmount : remainingAmount || "",
//         paymentMethod || "",
//         JSON.stringify(paymentMeta || {}),
//       ],
//     ];

//     // Append to sheet
//     try {
//       await sheets.spreadsheets.values.append({
//         spreadsheetId,
//         range: `${sheetTitle}!A2:Z`,
//         valueInputOption: "RAW",
//         requestBody: { values: appendValues },
//       });
//       console.log("✅ Booking added to Google Sheet:", { turfId, date, times: normTimesForWrite });
//     } catch (err) {
//       console.error("❌ Append to Google Sheets failed:", err?.message || err);
//       return NextResponse.json({ ok: false, error: "Failed to write booking to sheet" }, { status: 500 });
//     }

//     // Update in-memory store (best effort, non-blocking)
//     try {
//       const ownerId = turfOwners?.[turfId] || "owner-1";
//       const ranges = normalizedRequested.map((t) => (t.includes("-") ? t : timeToRange(t)));
//       if (!store.blocks) store.blocks = [];
//       if (!store.bookings) store.bookings = [];
//       store.blocks.push(...ranges.map((slot) => ({ ownerId, date, slot })));
//       store.bookings.push({
//         id: `b_${Date.now().toString(36)}`,
//         ownerId,
//         date,
//         time: ranges.join(", "),
//         sport: sport || "-",
//         customer: name || "Online Customer",
//         status: "active",
//         amount: advanceAmount ?? undefined,
//         source: "online",
//       });
//     } catch (err) {
//       console.warn("⚠️ Failed to update in-memory store:", err?.message || err);
//     }

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("❌ Uncaught error in booking confirm route:", err?.message || err);
//     return NextResponse.json({ ok: false, error: err?.message || "Internal error" }, { status: 500 });
//   }
// }


// // app/api/public/booking/confirm/route.js
// import { NextResponse } from "next/server";
// import { appendBookingRow } from "@/lib/google-sheets";

// /**
//  * Convert local slot time to UTC epoch (for 30-min validation)
//  */
// function slotEpochUtc(dateYYYYMMDD, timeHHMM, clientTzOffsetMinutes) {
//   const [y, m, d] = dateYYYYMMDD.split("-").map(Number);
//   const [hh, mm] = timeHHMM.split(":").map(Number);

//   // Create UTC timestamp from local date/time
//   return (
//     Date.UTC(y, m - 1, d, hh, mm) -
//     clientTzOffsetMinutes * 60 * 1000
//   );
// }

// export async function POST(req) {
//   try {
//     console.log("🟢 Booking confirm called");

//     let body;
//     try {
//       body = await req.json();
//     } catch {
//       return NextResponse.json(
//         { ok: false, error: "Invalid JSON body" },
//         { status: 400 }
//       );
//     }

//     const {
//       name,
//       phone,
//       email,
//       turfId,
//       turfName,
//       court,              // ✅ IMPORTANT
//       date,
//       timeSlots = [],
//       totalAmount,
//       advanceAmount,
//       remainingAmount,
//       paymentMethod,
//       paymentMeta = {},
//       tzOffsetMinutes = 0,
//     } = body;

//     // ---------- BASIC VALIDATION ----------
//     if (
//       !name ||
//       !phone ||
//       !email ||
//       !turfId ||
//       !date ||
//       !Array.isArray(timeSlots) ||
//       timeSlots.length === 0
//     ) {
//       return NextResponse.json(
//         { ok: false, error: "Missing required booking data" },
//         { status: 400 }
//       );
//     }

//     // ---------- 30 MINUTE RULE ----------
//     const nowUtc = Date.now();
//     const thresholdMs = 30 * 60 * 1000;

//     const lateSlots = timeSlots.filter((t) => {
//       try {
//         const slotUtc = slotEpochUtc(date, t, tzOffsetMinutes);
//         return slotUtc - nowUtc <= thresholdMs;
//       } catch {
//         return true;
//       }
//     });

//     if (lateSlots.length > 0) {
//       return NextResponse.json(
//         {
//           ok: false,
//           error: "Some slots are too close or already started",
//           conflicts: lateSlots,
//         },
//         { status: 400 }
//       );
//     }

//     // ---------- WRITE TO GOOGLE SHEETS ----------
//     await appendBookingRow({
//       name,
//       phone,
//       email,
//       venue: turfId,
//       court: String(court || "1"), // ✅ STORE AS 1 / 2 / 3
//       date,
//       timeSlot: timeSlots.join(", "),
//       durationHours: timeSlots.length,
//       totalAmount,
//       advanceAmount,
//       remainingAmount,
//       paymentMethod,
//       paymentMeta,
//     });

//     console.log("✅ Booking successfully written to Google Sheet");

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("❌ Booking confirm failed:", err);
//     return NextResponse.json(
//       { ok: false, error: err?.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/public/booking/confirm/route.js
import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/google-sheets";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      turfId,
      court,
      date,              // expected: "2026-01-16"
      timeSlots,         // expected: ["18:00"]
      totalAmount,
      advanceAmount,
      remainingAmount,
      paymentMethod,
      paymentMeta,
    } = body || {};

    // ---- BASIC VALIDATION ----
    if (
      !name ||
      !phone ||
      !email ||
      !turfId ||
      !date ||
      !Array.isArray(timeSlots) ||
      timeSlots.length === 0
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    // ---- NORMALIZE VALUES (CRITICAL PART) ----
    const timestampISO = new Date().toISOString();

    // Force TEXT so Google Sheets never converts them
    const safeDate = `'${date}`;                     // '2026-01-16
    const safeTimeSlot = `'${timeSlots.join(", ")}`; // '18:00
    const safeCourt = court ? String(court) : "1";

    const values = [
      [
        timestampISO,                 // A Timestamp
        name,                          // B Name
        phone,                         // C Phone
        email,                         // D Email
        turfId,                        // E Venue
        safeCourt,                     // F Court
        safeDate,                      // G Date (TEXT)
        safeTimeSlot,                 // H Time Slot (TEXT)
        Number(totalAmount) || 0,      // I Total Amount
        Number(advanceAmount) || 0,    // J Amount Paid
        Number(remainingAmount) || 0,  // K Amount Remaining
        paymentMethod || "",           // L Payment Mode
        JSON.stringify(paymentMeta || {}), // M Payment Meta
      ],
    ];

    const client = await getSheetsClient();
    const { sheets, spreadsheetId, sheetTitle } = client;

    // ---- APPEND ROW ----
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}!A2`,
      valueInputOption: "USER_ENTERED", // VERY IMPORTANT
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Booking confirm failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to record booking" },
      { status: 500 }
    );
  }
}
