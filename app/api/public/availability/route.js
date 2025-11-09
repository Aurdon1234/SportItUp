// import { NextResponse } from "next/server";
// import { getBlockedSlotsFor } from "@/lib/google-sheets";

// /**
//  * API Endpoint: /api/public/availability
//  * Example usage:
//  *   /api/public/availability?turfId=the-pavilion-amritsar-cricket&date=2025-11-09
//  *
//  * Reads your Google Sheet via getBlockedSlotsFor() and returns:
//  *   { ok: true, blockedHours: ["06:00", "07:00", ...] }
//  */
// export async function GET(req) {
//   try {
//     console.log("🟢 /api/public/availability called (Google Sheets mode)");

//     const { searchParams } = new URL(req.url);
//     const turfId = searchParams.get("turfId");
//     const date = searchParams.get("date");

//     if (!turfId || !date) {
//       return NextResponse.json(
//         { ok: false, error: "Missing turfId or date" },
//         { status: 400 }
//       );
//     }

//     // Get all blocked slots directly from Google Sheets
//     const blockedHours = await getBlockedSlotsFor(turfId, date);

//     console.log(
//       `✅ Found ${blockedHours.length} blocked slots for ${turfId} on ${date}:`,
//       blockedHours
//     );

//     return NextResponse.json({ ok: true, blockedHours });
//   } catch (err) {
//     console.error("❌ /api/public/availability failed:", err?.message || err);
//     return NextResponse.json(
//       { ok: false, error: err?.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/google-sheets";

/**
 * GET /api/public/availability?turfId=box-cricket-patiala&date=2025-11-09
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const turfId = searchParams.get("turfId");
    const date = searchParams.get("date");

    if (!turfId || !date) {
      return NextResponse.json(
        { ok: false, error: "Missing turfId or date" },
        { status: 400 }
      );
    }

    const client = await getSheetsClient();
    const { sheets, spreadsheetId, sheetTitle } = client;

    const range = `${sheetTitle}!A2:Z`;
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = res?.data?.values || [];

    const TURF_COL = 2; // Example column where turfId is stored
    const DATE_COL = 3; // Column with booking date
    const TIME_COL = 4; // Column with booked time

    const blocked = rows
      .filter(
        (r) =>
          (r[TURF_COL] || "").toLowerCase() === turfId.toLowerCase() &&
          (r[DATE_COL] || "").trim() === date
      )
      .flatMap((r) => (r[TIME_COL] || "").split(",").map((s) => s.trim()));

    const blockedHours = [...new Set(blocked)];

    return NextResponse.json({ ok: true, blockedHours });
  } catch (err) {
    console.error("❌ /availability failed:", err.message);
    return NextResponse.json(
      { ok: false, error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
