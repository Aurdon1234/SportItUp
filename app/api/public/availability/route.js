// // import { NextResponse } from "next/server";
// // import { getBlockedSlotsFor } from "@/lib/google-sheets";

// // /**
// //  * API Endpoint: /api/public/availability
// //  * Example usage:
// //  *   /api/public/availability?turfId=the-pavilion-amritsar-cricket&date=2025-11-09
// //  *
// //  * Reads your Google Sheet via getBlockedSlotsFor() and returns:
// //  *   { ok: true, blockedHours: ["06:00", "07:00", ...] }
// //  */
// // export async function GET(req) {
// //   try {
// //     console.log("🟢 /api/public/availability called (Google Sheets mode)");

// //     const { searchParams } = new URL(req.url);
// //     const turfId = searchParams.get("turfId");
// //     const date = searchParams.get("date");

// //     if (!turfId || !date) {
// //       return NextResponse.json(
// //         { ok: false, error: "Missing turfId or date" },
// //         { status: 400 }
// //       );
// //     }

// //     // Get all blocked slots directly from Google Sheets
// //     const blockedHours = await getBlockedSlotsFor(turfId, date);

// //     console.log(
// //       `✅ Found ${blockedHours.length} blocked slots for ${turfId} on ${date}:`,
// //       blockedHours
// //     );

// //     return NextResponse.json({ ok: true, blockedHours });
// //   } catch (err) {
// //     console.error("❌ /api/public/availability failed:", err?.message || err);
// //     return NextResponse.json(
// //       { ok: false, error: err?.message || "Internal Server Error" },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextResponse } from "next/server";
// import { getSheetsClient } from "@/lib/google-sheets";

// /**
//  * GET /api/public/availability?turfId=box-cricket-patiala&date=2025-11-09
//  */
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const turfId = searchParams.get("turfId");
//     const date = searchParams.get("date");

//     if (!turfId || !date) {
//       return NextResponse.json(
//         { ok: false, error: "Missing turfId or date" },
//         { status: 400 }
//       );
//     }

//     const client = await getSheetsClient();
//     const { sheets, spreadsheetId, sheetTitle } = client;

//     const range = `${sheetTitle}!A2:Z`;
//     const res = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//     });

//     const rows = res?.data?.values || [];

//     const TURF_COL = 2; // Example column where turfId is stored
//     const DATE_COL = 3; // Column with booking date
//     const TIME_COL = 4; // Column with booked time

//     const blocked = rows
//       .filter(
//         (r) =>
//           (r[TURF_COL] || "").toLowerCase() === turfId.toLowerCase() &&
//           (r[DATE_COL] || "").trim() === date
//       )
//       .flatMap((r) => (r[TIME_COL] || "").split(",").map((s) => s.trim()));

//     const blockedHours = [...new Set(blocked)];

//     return NextResponse.json({ ok: true, blockedHours });
//   } catch (err) {
//     console.error("❌ /availability failed:", err.message);
//     return NextResponse.json(
//       { ok: false, error: err.message || "Internal error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/google-sheets";

/**
 * GET /api/public/availability?turfId=...&date=YYYY-MM-DD
 * Returns: { ok: true, blockedHours: ["08:00", "09:00", ...] }
 */
function normalizeTimeToHHMM(raw) {
  if (!raw) return null;
  let s = String(raw).trim();

  // common separators -> single form
  s = s.replace(/\s+/g, " ").replace(/\./g, ":");

  // If it's just hour like "8" or "8am" or "8 AM"
  const ampmMatch = s.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (ampmMatch) {
    let hour = parseInt(ampmMatch[1], 10);
    let minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const ampm = ampmMatch[3] ? ampmMatch[3].toLowerCase() : null;

    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    if (hour < 0 || hour > 23) return null;
    if (minutes < 0 || minutes > 59) minutes = 0;

    return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  // If it's already HH:MM or H:MM
  const hm = s.match(/(\d{1,2}):(\d{2})/);
  if (hm) {
    let h = parseInt(hm[1], 10);
    let m = parseInt(hm[2], 10);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // If it's like "1700" or "0800"
  const digits = s.match(/^(\d{3,4})$/);
  if (digits) {
    const val = digits[1];
    const h = val.length === 3 ? parseInt(val.slice(0,1),10) : parseInt(val.slice(0,2),10);
    const m = val.length === 3 ? parseInt(val.slice(1),10) : parseInt(val.slice(2),10);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
  }

  return null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const turfId = searchParams.get("turfId");
    const date = searchParams.get("date");

    if (!turfId || !date) {
      return NextResponse.json({ ok: false, error: "Missing turfId or date" }, { status: 400 });
    }

    const client = await getSheetsClient();
    if (!client || !client.sheets || !client.spreadsheetId || !client.sheetTitle) {
      console.error("getSheetsClient missing or invalid:", client);
      return NextResponse.json({ ok: false, error: "Sheets client not configured" }, { status: 500 });
    }

    const { sheets, spreadsheetId, sheetTitle } = client;
    const range = `${sheetTitle}!A1:Z`; // include header row
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res?.data?.values || [];

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, blockedHours: [] });
    }

    // Find header indices if present (case-insensitive)
    const header = rows[0].map((h) => (h || "").toString().trim().toLowerCase());
    const turfColIndex = header.findIndex((h) => ["turf","turfid","turf_id","turf id","slug"].includes(h));
    const dateColIndex = header.findIndex((h) => ["date","bookingdate","booking date"].includes(h));
    const timeColIndex = header.findIndex((h) => ["time","timeslot","time slot","slot"].includes(h));

    // Fallback to the original guessed columns (0-based)
    const TURF_COL = turfColIndex >= 0 ? turfColIndex : 2; // default C (index 2)
    const DATE_COL = dateColIndex >= 0 ? dateColIndex : 3; // default D (index 3)
    const TIME_COL = timeColIndex >= 0 ? timeColIndex : 4; // default E (index 4)

    // iterate rows after header (if header detected) or from row 2 as before
    const startRow = header.some(Boolean) ? 1 : 1;

    const blockedSet = new Set();

    for (let i = startRow; i < rows.length; i++) {
      const r = rows[i] || [];
      const turfCell = (r[TURF_COL] || "").toString().trim().toLowerCase();
      const dateCell = (r[DATE_COL] || "").toString().trim();
      const timeCell = (r[TIME_COL] || "").toString().trim();

      if (!turfCell || !dateCell || !timeCell) continue;

      if (turfCell !== turfId.toLowerCase()) continue;
      if (dateCell !== date) continue;

      // allow multiple time values in the cell separated by comma/semicolon/pipe
      const parts = timeCell.split(/\s*[;,|]\s*/).map((s) => s.trim()).filter(Boolean);
      for (const p of parts) {
        const norm = normalizeTimeToHHMM(p) || p; // fallback to raw if no parse
        if (norm) blockedSet.add(norm);
      }
    }

    const blockedHours = Array.from(blockedSet).sort();

    return NextResponse.json({ ok: true, blockedHours });
  } catch (err) {
    console.error("❌ /availability failed:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Internal error" }, { status: 500 });
  }
}
