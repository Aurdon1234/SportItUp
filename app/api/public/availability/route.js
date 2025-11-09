import { NextResponse } from "next/server";
import { getBlockedSlotsFor } from "@/lib/google-sheets";

/**
 * API Endpoint: /api/public/availability
 * Example usage:
 *   /api/public/availability?turfId=the-pavilion-amritsar-cricket&date=2025-11-09
 *
 * Reads your Google Sheet via getBlockedSlotsFor() and returns:
 *   { ok: true, blockedHours: ["06:00", "07:00", ...] }
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

    // Get all blocked slots directly from Google Sheets
    const blockedHours = await getBlockedSlotsFor(turfId, date);

    console.log(
      `✅ Found ${blockedHours.length} blocked slots for ${turfId} on ${date}:`,
      blockedHours
    );

    return NextResponse.json({ ok: true, blockedHours });
  } catch (err) {
    console.error("❌ /api/public/availability failed:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
