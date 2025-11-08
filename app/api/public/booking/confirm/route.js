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

// Before appending to Sheet:
const sheets = await getSheetsClient();
const spreadsheetId = process.env.GOOGLE_SHEET_ID;
const sheetTitle = process.env.GOOGLE_SHEETS_SHEET_TITLE || "Bookings";

const response = await sheets.spreadsheets.values.get({
  spreadsheetId,
  range: `${sheetTitle}!A2:Z`,
});
const rows = response.data.values || [];

// Conflict check
const conflicts = rows
  .filter((r) => {
    const venue = (r[4] || "").trim().toLowerCase();
    const bookingDate = (r[5] || "").trim();
    return venue.includes(turfId.toLowerCase()) && bookingDate === date;
  })
  .flatMap((r) => (r[6] || "").split(",").map((s) => s.trim()));

const conflictingSlots = timeSlots.filter((s) => conflicts.includes(s));

if (conflictingSlots.length > 0) {
  console.warn("⚠️ Booking conflict detected:", conflictingSlots);
  return NextResponse.json(
    { ok: false, error: "Some slots already booked", conflicts: conflictingSlots },
    { status: 409 }
  );
}
