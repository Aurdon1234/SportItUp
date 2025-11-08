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
import { getSheetsClient } from "@/lib/google-sheets";
import { store, turfOwners } from "@/lib/store";

/** Convert "06:00" -> "06:00-07:00" (optional for in-memory store) */
function timeToRange(hourHHMM) {
  const [h, m] = hourHHMM.split(":").map(Number);
  const endH = String((h + 1) % 24).padStart(2, "0");
  return `${String(h).padStart(2, "0")}:${m.toString().padStart(2, "0")}-${endH}:${m.toString().padStart(2, "0")}`;
}

export async function POST(req) {
  try {
    console.log("🟢 /api/public/booking/confirm called (Google Sheets)");

    const body = await req.json().catch(() => null);
    if (!body) {
      console.warn("⚠️ booking confirm: invalid or missing JSON body");
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      name, phone, email,
      totalAmount, advanceAmount, remainingAmount,
      turfId, turfName, location, city, sport,
      date, // YYYY-MM-DD
      timeSlots = [], // ["06:00","07:00"]
      paymentMethod, paymentMeta = {},
    } = body;

    if (!turfId || !date || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return NextResponse.json({ ok: false, error: "Missing turfId, date or timeSlots" }, { status: 400 });
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetTitle = process.env.GOOGLE_SHEETS_SHEET_TITLE || "Bookings";
    if (!spreadsheetId) {
      console.error("❌ GOOGLE_SHEET_ID not set");
      return NextResponse.json({ ok: false, error: "Server misconfiguration: GOOGLE_SHEET_ID missing" }, { status: 500 });
    }

    // getSheetsClient -> must return google.sheets client
    let sheets;
    try {
      sheets = await getSheetsClient();
      if (!sheets || typeof sheets.spreadsheets?.values?.get !== "function") {
        console.error("❌ getSheetsClient returned an invalid sheets client:", { sheetsAvailable: !!sheets });
        return NextResponse.json({ ok: false, error: "Google Sheets client invalid" }, { status: 500 });
      }
    } catch (err) {
      console.error("❌ getSheetsClient failed:", err && err.message ? err.message : err);
      return NextResponse.json({ ok: false, error: "Failed to initialize Google Sheets client" }, { status: 500 });
    }

    // Read existing rows
    const readRange = `${sheetTitle}!A2:Z`;
    let readRes;
    try {
      readRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: readRange,
      });
    } catch (err) {
      console.error("❌ Google Sheets API call failed (spreadsheets.values.get):", err && err.message ? err.message : err);
      return NextResponse.json({ ok: false, error: "Failed to read bookings sheet (Sheets API error)" }, { status: 500 });
    }

    // Defensive check
    if (!readRes || !readRes.data) {
      console.error("❌ Google Sheets read response is empty or malformed:", { readRes });
      return NextResponse.json({ ok: false, error: "Empty response from Sheets API" }, { status: 500 });
    }

    const rows = readRes.data.values || [];

    // Column indexes (0-based). Adjust to match your sheet.
    const VENUE_COL = 4; // E
    const DATE_COL = 5; // F
    const TIMESLOT_COL = 6; // G

    // Build existing slots for same turf/date
    const existingSlots = rows
      .filter((r) => {
        const venueCell = (r[VENUE_COL] || "").toString().trim().toLowerCase();
        const bookingDate = (r[DATE_COL] || "").toString().trim();
        if (!bookingDate) return false;
        const matchesVenue = turfId && venueCell.includes(String(turfId).toLowerCase());
        const matchesName = turfName && venueCell.includes(String(turfName).toLowerCase());
        return bookingDate === date && (matchesVenue || matchesName);
      })
      .flatMap((r) => {
        const ts = (r[TIMESLOT_COL] || "").toString();
        return ts.split(",").map((s) => s.trim()).filter(Boolean);
      });

    const existingSet = new Set(existingSlots);
    const conflictingSlots = timeSlots.filter((t) => existingSet.has(t));
    if (conflictingSlots.length > 0) {
      console.warn("⚠️ Booking conflict detected (sheet):", conflictingSlots);
      return NextResponse.json({ ok: false, error: "Some slots already booked", conflicts: conflictingSlots }, { status: 409 });
    }

    // Append booking
    const timestampISO = new Date().toISOString();
    const appendValues = [
      [
        timestampISO,
        name || "",
        phone || "",
        email || "",
        turfName || location || turfId || "Venue",
        date,
        timeSlots.join(", "),
        typeof totalAmount === "number" ? totalAmount : (totalAmount ?? ""),
        typeof advanceAmount === "number" ? advanceAmount : (advanceAmount ?? ""),
        typeof remainingAmount === "number" ? remainingAmount : (remainingAmount ?? ""),
        paymentMethod || "",
        JSON.stringify(paymentMeta || {}),
      ],
    ];

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetTitle}!A2:Z`,
        valueInputOption: "RAW",
        requestBody: { values: appendValues },
      });
      console.log("✅ Booking appended to Google Sheet:", { turfId, date, timeSlots });
    } catch (err) {
      console.error("❌ Failed to append booking to sheet:", err && err.message ? err.message : err);
      return NextResponse.json({ ok: false, error: "Failed to write booking to sheet" }, { status: 500 });
    }

    // Optional in-memory store update
    try {
      const ownerId = (turfOwners && turfOwners[turfId]) || "owner-1";
      const normalizedRanges = timeSlots.map((t) => (t.includes("-") ? t : timeToRange(t)));
      if (store && Array.isArray(store.blocks)) {
        normalizedRanges.forEach((range) => {
          store.blocks.push({ ownerId, date, slot: range });
        });
      }
      if (store && Array.isArray(store.bookings)) {
        const id = `b_${Date.now().toString(36)}`;
        store.bookings.push({
          id,
          ownerId,
          date,
          time: normalizedRanges.join(", "),
          sport: sport || "-",
          customer: name || "Online Customer",
          status: "active",
          amount: typeof advanceAmount === "number" ? advanceAmount : undefined,
          source: "online",
        });
      }
      console.log("ℹ️ In-memory store updated (if present)");
    } catch (err) {
      console.warn("⚠️ Failed to update in-memory store:", err && err.message ? err.message : err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Uncaught error in booking confirm route:", err && err.message ? err.message : err);
    return NextResponse.json({ ok: false, error: err.message || "Failed to confirm booking" }, { status: 500 });
  }
}
