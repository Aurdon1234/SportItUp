import { NextResponse } from "next/server";
import { appendBookingRow } from "@/lib/google-sheets";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name, phone, email,
      turfName, location, date,
      timeSlot, duration, amount,
      notes
    } = body;

    await appendBookingRow({
      timestampISO: new Date().toISOString(),
      name,
      phone,
      email,
      venue: turfName || location || "Venue",
      date,
      timeSlot,                     // or join multiple into a string if you like
      durationHours: duration,
      totalAmount: amount,
      notes,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
