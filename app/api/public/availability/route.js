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
 * API Endpoint: /api/public/availability
 * Example usage:
 *   /api/public/availability?turfId=the-pavilion-amritsar-cricket&date=2025-11-09
 *
 * Reads your Google Sheet and returns blocked (booked) hours.
 */
export async function GET(req) {
  try {
    console.log("🟢 /api/public/availability called (Google Sheets mode)");

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

    const VENUE_COL = 4; // E
    const DATE_COL = 5; // F
    const TIME_COL = 6; // G

    const blocked = rows
      .filter((r) => {
        const venue = (r[VENUE_COL] || "").toLowerCase();
        const bookingDate = (r[DATE_COL] || "").trim();
        const matchVenue =
          venue.includes(turfId.toLowerCase()) ||
          turfId.toLowerCase().includes(venue);
        return bookingDate === date && matchVenue;
      })
      .flatMap((r) =>
        (r[TIME_COL] || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      );

    const blockedHours = [...new Set(blocked)];
    console.log(`✅ Found ${blockedHours.length} blocked slots for ${turfId}:`, blockedHours);

    return NextResponse.json({ ok: true, blockedHours });
  } catch (err) {
    console.error("❌ /availability failed:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
