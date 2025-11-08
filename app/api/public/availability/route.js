// // import { NextResponse } from "next/server"
// // import { store, turfOwners } from "@/lib/store"

// // export async function GET(req) {
// //   const { searchParams } = new URL(req.url)
// //   const turfId = searchParams.get("turfId")
// //   const date = searchParams.get("date")
// //   if (!turfId || !date) return NextResponse.json({ error: "Missing params" }, { status: 400 })

// //   const ownerId = turfOwners[turfId] || "owner-1"

// //   // collect blocked slots from manual blocks
// //   const blockedFromBlocks = store.blocks.filter((b) => b.ownerId === ownerId && b.date === date).map((b) => b.slot)

// //   // also block any active bookings
// //   const blockedFromBookings = store.bookings
// //     .filter((b) => b.ownerId === ownerId && b.date === date && b.status === "active")
// //     .map((b) => b.time)

// //   // collapse to unique set
// //   const blocked = Array.from(new Set([...blockedFromBlocks, ...blockedFromBookings]))

// //   // Additionally provide hours (HH:MM) to make UI matching easy
// //   const blockedHours = blocked.map((range) => (range.includes("-") ? range.split("-")[0] : range))

// //   return NextResponse.json({ date, blocked, blockedHours })
// // }

// import { NextResponse } from "next/server";
// import { getSupabaseServerClient } from "@/lib/supabase/server";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const turfId = searchParams.get("turfId");
//   const date = searchParams.get("date"); // YYYY-MM-DD

//   if (!turfId || !date) {
//     return NextResponse.json({ error: "Missing turfId or date" }, { status: 400 });
//   }

//   // uses service role by default (as your server client is written)
//   const supabase = getSupabaseServerClient();

//   // Example schema: bookings(turf_id text, date date, time_slot text)
//   const { data, error } = await supabase
//     .from("bookings")
//     .select("time_slot")
//     .eq("turf_id", turfId)
//     .eq("date", date);

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   const blockedHours = (data ?? []).map(r => r.time_slot);
//   return NextResponse.json({ blockedHours });
// }

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
