// import twilio from "twilio";

// export async function POST(req) {
//   try {
//     const { phone } = await req.json();
//     if (!phone) {
//       return new Response(JSON.stringify({ error: "Phone number required" }), { status: 400 });
//     }

//     const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//     await client.verify.v2.services(process.env.TWILIO_VERIFY_SID).verifications.create({
//       to: `+91${phone}`, // adjust if you want to support other countries
//       channel: "sms",
//     });

//     return Response.json({ ok: true });
//   } catch (error) {
//     console.error("OTP send failed:", error);
//     return Response.json({ ok: false, error: error.message });
//   }
// }

// app/api/send-otp/route.js
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch"; // node-fetch if needed in your environment
// Simple in-memory store; replace with persistent store in production
const OTP_STORE = global.__OTP_STORE ||= new Map();

const OTP_TTL_MS = 2 * 60 * 1000; // 2 minutes

function generateOtp(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1) + min));
}

export async function POST(req) {
  try {
    const { phone } = await req.json();
    if (!phone) return new Response(JSON.stringify({ ok: false, error: "missing phone" }), { status: 400 });

    const otp = generateOtp(6);
    const sessionId = uuidv4();
    const expiresAt = Date.now() + OTP_TTL_MS;

    // store hashed or plain OTP in memory (hashing recommended)
    OTP_STORE.set(sessionId, { otp, phone, expiresAt });

    // Build SMS message
    const message = `Your SportItUp OTP is ${otp}. It expires in 2 minutes.`;

    // call Renflair API - replace with the exact Renflair endpoint/params they provide
    const RENFLAIR_URL = process.env.RENFLAIR_API_URL; // e.g. https://renflair.in/api/send_sms.php
    const RENFLAIR_KEY = process.env.RENFLAIR_API_KEY;
    if (!RENFLAIR_URL || !RENFLAIR_KEY) {
      console.warn("RENFLAIR env vars missing");
      // still return success for dev flow if you plan to use test-mode
      return new Response(JSON.stringify({ ok: true, sessionId }), { status: 200 });
    }

    // Example POST to Renflair - replace body/query according to Renflair docs
    const payload = {
      api_key: RENFLAIR_KEY,
      to: phone,
      message,
      sender: process.env.RENFLAIR_SENDER || "SPORTUP",
    };

    // If Renflair expects GET with query params, change accordingly.
    await fetch(RENFLAIR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return new Response(JSON.stringify({ ok: true, sessionId }), { status: 200 });
  } catch (err) {
    console.error("send-otp error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
