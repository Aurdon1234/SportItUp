// import { NextResponse } from "next/server";
// import { appendBookingRow } from "@/lib/google-sheets";
// import { store, turfOwners } from "@/lib/store";
// import { getSupabaseServerClient } from "@/lib/supabase/server";

// // Utility: "06:00" -> "06:00-07:00"
// function timeToRange(hourHHMM) {
//   const [h, m] = hourHHMM.split(":").map(Number);
//   const endH = String((h + 1) % 24).padStart(2, "0");
//   return `${String(h).padStart(2, "0")}:${m.toString().padStart(2, "0")}-${endH}:${m.toString().padStart(2, "0")}`;
// }

// export async function POST(req) {
//   try {
//     const body = await req.json().catch(() => null);
//     if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

//     const {
//       // who & how much
//       name, phone, email,
//       totalAmount, advanceAmount, remainingAmount,

//       // what & when
//       turfId, turfName, location, city, sport,
//       date,               // "YYYY-MM-DD"
//       timeSlots = [],     // ["06:00","07:00",...]

//       // meta
//       paymentMethod,      // "razorpay" | "upi" | "card" | "wallet"
//       paymentMeta = {},   // provider ids, signature, or simulated flag
//     } = body;

//     if (!turfId || !date || !Array.isArray(timeSlots) || timeSlots.length === 0) {
//       return NextResponse.json({ ok: false, error: "Missing turfId/date/timeSlots" }, { status: 400 });
//     }

//     const ownerId = turfOwners[turfId] || "owner-1";

//     // 1) Append a row to Google Sheets (confirmed bookings only)
//     await appendBookingRow({
//       timestampISO: new Date().toISOString(),
//       name: name || "Online Customer",
//       phone: phone || "",
//       email: email || "",
//       venue: turfName || location || "Venue",
//       date,                                      // YYYY-MM-DD
//       timeSlot: timeSlots.join(", "),            // human readable
//       durationHours: timeSlots.length,
//       totalAmount: typeof totalAmount === "number" ? totalAmount : "",
//       notes: `Advance: ₹${advanceAmount ?? ""}, Remaining: ₹${remainingAmount ?? ""}, Method: ${paymentMethod || "-"}, Meta: ${JSON.stringify(paymentMeta)}`,
//       sheetTitle: process.env.GOOGLE_SHEETS_SHEET_TITLE || "Bookings",
//     });

//     // 2) Block the selected slots in memory so they don’t appear available
//     const normalizedRanges = timeSlots.map(t => (t.includes("-") ? t : timeToRange(t)));
//     normalizedRanges.forEach(range => {
//       store.blocks.push({ ownerId, date, slot: range });
//     });

//     // 3) (Optional) Persist to Supabase for real storage
//     //    Uncomment if you have a "bookings" table ready.
//     // const supabase = getSupabaseServerClient({ useServiceRole: true });
//     // for (const t of timeSlots) {
//     //   await supabase.from("bookings").insert({
//     //     turf_id: turfId,
//     //     date,
//     //     time_slot: t, // store as "06:00" or range, but be consistent with your availability reader
//     //     name,
//     //     phone,
//     //     email,
//     //     venue: turfName || location || "Venue",
//     //     sport: sport || null,
//     //     city: city || null,
//     //     amount_total: totalAmount ?? null,
//     //     amount_advance: advanceAmount ?? null,
//     //     provider: paymentMeta?.provider || paymentMethod || "unknown",
//     //     provider_payment_id: paymentMeta?.payment_id || null,
//     //     provider_order_id: paymentMeta?.razorpay_order_id || null,
//     //     provider_signature: paymentMeta?.razorpay_signature || null,
//     //     status: "confirmed",
//     //     source: "online",
//     //   });
//     // }

//     // 4) Mirror the booking in the in-memory store (useful for your existing admin views)
//     const id = `b_${Date.now().toString(36)}`;
//     store.bookings.push({
//       id,
//       ownerId,
//       date,
//       time: normalizedRanges.join(", "),
//       sport: sport || "-",
//       customer: name || "Online Customer",
//       status: "active",
//       amount: typeof advanceAmount === "number" ? advanceAmount : undefined, // what was actually paid now
//       source: "online",
//     });

//     return NextResponse.json({ ok: true, id });
//   } catch (e) {
//     return NextResponse.json({ ok: false, error: e.message || "Failed to confirm booking" }, { status: 500 });
//   }
// }

// app/api/public/booking/confirm/route.js
import { NextResponse } from "next/server";
import { appendBookingRow } from "@/lib/google-sheets";
import { store, turfOwners } from "@/lib/store";
// import { getSupabaseServerClient } from "@/lib/supabase/server"; // optional

function timeToRange(hourHHMM) {
  const [h, m] = hourHHMM.split(":").map(Number);
  const endH = String((h + 1) % 24).padStart(2, "0");
  return `${String(h).padStart(2, "0")}:${m.toString().padStart(2, "0")}-${endH}:${m.toString().padStart(2, "0")}`;
}

export async function POST(req) {
  try {
    console.log("🟢 /api/public/booking/confirm called");

    // Basic env checks
    console.log("ENV: GOOGLE_SHEETS_SHEET_TITLE:", process.env.GOOGLE_SHEETS_SHEET_TITLE || "(not set)");
    console.log("ENV: GOOGLE_CLIENT_EMAIL:", !!process.env.GOOGLE_CLIENT_EMAIL);
    console.log("ENV: GOOGLE_PRIVATE_KEY present:", !!process.env.GOOGLE_PRIVATE_KEY);
    console.log("ENV: GOOGLE_SHEET_ID:", !!process.env.GOOGLE_SHEET_ID);

    const body = await req.json().catch((err) => {
      console.error("❌ Failed parsing JSON body:", err);
      return null;
    });
    if (!body) {
      console.error("❌ Missing or invalid JSON body");
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    console.log("📦 Booking payload received:", {
      turfId: body.turfId,
      turfName: body.turfName,
      date: body.date,
      timeSlots: Array.isArray(body.timeSlots) ? body.timeSlots.length : body.timeSlots,
      totalAmount: body.totalAmount,
      advanceAmount: body.advanceAmount,
      paymentMethod: body.paymentMethod,
    });

    const {
      name, phone, email,
      totalAmount, advanceAmount, remainingAmount,
      turfId, turfName, location, city, sport,
      date,
      timeSlots = [],
      paymentMethod,
      paymentMeta = {},
    } = body;

    if (!turfId || !date || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      console.error("❌ Missing turfId/date/timeSlots in payload");
      return NextResponse.json(
        { ok: false, error: "Missing turfId/date/timeSlots" },
        { status: 400 }
      );
    }

    const ownerId = turfOwners[turfId] || "owner-1";

    // 1) Append a row to Google Sheets (confirmed bookings only)
    try {
      const sheetPayload = {
        timestampISO: new Date().toISOString(),
        name: name || "Online Customer",
        phone: phone || "",
        email: email || "",
        venue: turfName || location || "Venue",
        date,
        timeSlot: timeSlots.join(", "),
        durationHours: timeSlots.length,
        totalAmount: typeof totalAmount === "number" ? totalAmount : "",
        notes: `Advance: ₹${advanceAmount ?? ""}, Remaining: ₹${remainingAmount ?? ""}, Method: ${paymentMethod || "-"}, Meta: ${JSON.stringify(paymentMeta)}`,
        sheetTitle: process.env.GOOGLE_SHEETS_SHEET_TITLE || "Bookings",
      };

      console.log("➡️ Calling appendBookingRow with:", sheetPayload);
      await appendBookingRow(sheetPayload);
      console.log("✅ appendBookingRow succeeded");
    } catch (err) {
      // log full error details for Vercel logs
      console.error("❌ appendBookingRow failed:", err && err.message ? err.message : err);
      // return error so caller sees the failure (and you can inspect logs)
      return NextResponse.json({ ok: false, error: "Failed to write to Google Sheets", details: String(err) }, { status: 500 });
    }

    // 2) Block the selected slots in memory
    try {
      const normalizedRanges = timeSlots.map((t) => (t.includes("-") ? t : timeToRange(t)));
      normalizedRanges.forEach((range) => {
        store.blocks.push({ ownerId, date, slot: range });
      });
      console.log("✅ in-memory blocks updated:", normalizedRanges);
    } catch (err) {
      console.error("⚠️ Failed to update in-memory blocks:", err);
      // do not fail the whole request for in-memory update; continue
    }

    // 3) (Optional) Persist to Supabase - disabled by default
    // ... left as comments; uncomment & add try/catch if you need to persist.

    // 4) Mirror booking into in-memory bookings (useful for admin)
    try {
      const id = `b_${Date.now().toString(36)}`;
      store.bookings.push({
        id,
        ownerId,
        date,
        time: timeSlots.map((t) => (t.includes("-") ? t : timeToRange(t))).join(", "),
        sport: sport || "-",
        customer: name || "Online Customer",
        status: "active",
        amount: typeof advanceAmount === "number" ? advanceAmount : undefined,
        source: "online",
      });
      console.log("✅ store.bookings updated, id:", id);
    } catch (err) {
      console.error("⚠️ Failed to update store.bookings:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("❌ Uncaught error in booking confirm route:", e);
    return NextResponse.json({ ok: false, error: e.message || "Failed to confirm booking" }, { status: 500 });
  }
}
