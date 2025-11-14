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

// app/api/public/availability/route.js
import { NextResponse } from "next/server";
import { getAllBookingRows } from "@/lib/google-sheets"; // change if your helper name differs

// Column indexes (0-based)
const VENUE_COL = 4; // E
const DATE_COL = 5;  // F
const TIMESLOT_COL = 6; // G

function normalizeSheetDate(cell) {
  if (!cell) return null;
  const s = String(cell).trim();

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Try MM/DD/YYYY or M/D/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [m, d, y] = s.split("/").map(Number);
    return `${String(y).padStart(4,"0")}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  }

  // Try DD/MM/YYYY
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(s)) {
    // ambiguous; treat as DD-MM-YYYY -> convert to YYYY-MM-DD
    const [d, m, y] = s.split("-").map(Number);
    return `${String(y).padStart(4,"0")}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  }

  // Try parsing via Date (best-effort)
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    return d.toISOString().split("T")[0];
  }

  return null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const turfId = (searchParams.get("turfId") || "").toLowerCase().trim();
    const date = (searchParams.get("date") || "").trim();

    if (!turfId || !date) {
      return NextResponse.json({ ok: false, error: "Missing turfId or date" }, { status: 400 });
    }

    let rows = [];
    try {
      rows = await getAllBookingRows(); // should return an array of row arrays
    } catch (err) {
      console.error("getAllBookingRows failed:", err);
      return NextResponse.json({ ok: false, error: "Failed reading sheet", details: String(err) }, { status: 500 });
    }

    console.log(`[availability] turfId=${turfId} date=${date} rowsCount=${rows.length}`);
    console.log("[availability] sample rows:", rows.slice(0, 6));

    const booked = rows
      .filter((r) => {
        const venueCell = String(r[VENUE_COL] || "").toLowerCase().trim();
        const dateCellRaw = r[DATE_COL];
        const bookingDate = normalizeSheetDate(dateCellRaw);

        if (!bookingDate) return false;
        if (bookingDate !== date) return false;

        // match if venue cell contains the turfId slug OR any word from turfId appears in venue
        if (venueCell.includes(turfId)) return true;

        const venueWords = venueCell.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
        const idWords = turfId.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
        return idWords.some((w) => venueWords.includes(w));
      })
      .flatMap((r) => {
        const slotCell = String(r[TIMESLOT_COL] || "").trim();
        if (!slotCell) return [];
        return slotCell
          .split(/[,;\n]+/)
          .map((s) => s.trim())
          .filter(Boolean);
      });

    const blockedHours = [...new Set(booked)];

    console.log(`[availability] blockedHours (${blockedHours.length}):`, blockedHours);

    return NextResponse.json({ ok: true, blockedHours });
  } catch (err) {
    console.error("availability unexpected error:", err);
    return NextResponse.json({ ok: false, error: "Internal error", details: String(err) }, { status: 500 });
  }
}
