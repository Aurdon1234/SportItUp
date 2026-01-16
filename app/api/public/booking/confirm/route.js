// app/api/public/booking/confirm/route.js
import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/google-sheets";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      turfId,
      court,
      date,              // expected: "2026-01-16"
      timeSlots,         // expected: ["18:00"]
      totalAmount,
      advanceAmount,
      remainingAmount,
      paymentMethod,
      paymentMeta,
    } = body || {};

    // ---- BASIC VALIDATION ----
    if (
      !name ||
      !phone ||
      !email ||
      !turfId ||
      !date ||
      !Array.isArray(timeSlots) ||
      timeSlots.length === 0
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    // ---- NORMALIZE VALUES (CRITICAL PART) ----
    const timestampISO = new Date().toISOString();

    // Force TEXT so Google Sheets never converts them
    const safeDate = `'${date}`;                     // '2026-01-16
    const safeTimeSlot = `'${timeSlots.join(", ")}`; // '18:00
    const safeCourt = court ? String(court) : "1";

    const values = [
      [
        timestampISO,                 // A Timestamp
        name,                          // B Name
        phone,                         // C Phone
        email,                         // D Email
        turfId,                        // E Venue
        safeCourt,                     // F Court
        safeDate,                      // G Date (TEXT)
        safeTimeSlot,                 // H Time Slot (TEXT)
        Number(totalAmount) || 0,      // I Total Amount
        Number(advanceAmount) || 0,    // J Amount Paid
        Number(remainingAmount) || 0,  // K Amount Remaining
        paymentMethod || "",           // L Payment Mode
        JSON.stringify(paymentMeta || {}), // M Payment Meta
      ],
    ];

    const client = await getSheetsClient();
    const { sheets, spreadsheetId, sheetTitle } = client;

    // ---- APPEND ROW ----
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}!A2`,
      valueInputOption: "USER_ENTERED", // VERY IMPORTANT
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Booking confirm failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to record booking" },
      { status: 500 }
    );
  }
}
