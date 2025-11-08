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

// app/api/public/availability/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  try {
    console.log("🟢 /api/public/availability called");

    const { searchParams } = new URL(req.url);
    const turfId = searchParams.get("turfId");
    const date = searchParams.get("date");

    if (!turfId || !date) {
      console.warn("⚠️ Missing params", { turfId, date });
      return NextResponse.json(
        { ok: false, error: "Missing turfId or date" },
        { status: 400 }
      );
    }

    // ✅ Verify environment variables exist
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error("❌ Supabase env vars missing:", {
        url: !!url,
        key: !!key,
      });
      return NextResponse.json(
        { ok: false, error: "Supabase environment variables not set" },
        { status: 500 }
      );
    }

    // ✅ Initialize client safely
    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });

    console.log("🔍 Querying bookings for", { turfId, date });

    const { data, error } = await supabase
      .from("bookings")
      .select("time_slot")
      .eq("turf_id", turfId)
      .eq("date", date);

    if (error) {
      console.error("❌ Supabase query failed:", error.message);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const blockedHours = (data ?? []).map((r) => r.time_slot);
    console.log("✅ Returning blocked hours:", blockedHours);

    return NextResponse.json({ ok: true, blockedHours });
  } catch (err) {
    console.error("❌ /availability internal error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
