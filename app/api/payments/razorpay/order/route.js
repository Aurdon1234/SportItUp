import { NextResponse } from "next/server";

export async function POST(req) {
  const secret = process.env.RAZORPAY_SECRET;
  const keyId  = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  if (!secret || !keyId) {
    return NextResponse.json({ error: "Razorpay keys not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const amount = Number(body.amount || 0); // INR
  const currency = body.currency || "INR";
  const notes = body.notes || {};

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const resp = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${keyId}:${secret}`).toString("base64"),
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // paise
      currency,
      notes,
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    return NextResponse.json({ error: txt || "Failed to create order" }, { status: 500 });
  }

  const order = await resp.json();
  return NextResponse.json({
    id: order.id,
    amount: order.amount,
    amountInPaise: order.amount,
    currency: order.currency,
  });
}
