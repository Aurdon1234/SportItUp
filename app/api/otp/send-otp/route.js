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

// app/api/otp/send-otp/route.js
import { randomBytes } from "crypto";

// simple in-memory map for OTP sessions (dev only)
const OTP_STORE = global.__OTP_STORE ||= new Map();
const OTP_TTL_MS = 2 * 60 * 1000; // 2 minutes

function generateOtp(len = 6) {
  const max = 10 ** len - 1;
  const min = 10 ** (len - 1);
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export async function POST(req) {
  try {
    const { phone } = await req.json();
    if (!phone) return new Response(JSON.stringify({ ok: false, error: "missing phone" }), { status: 400, headers:{ "Content-Type":"application/json" } });

    // normalize phone if needed (assume client sends +91... or full E.164)
    const otp = generateOtp(6);
    const sessionId = randomBytes(12).toString("hex");
    const expiresAt = Date.now() + OTP_TTL_MS;

    // store session (in production use Redis/Vercel KV)
    OTP_STORE.set(sessionId, { phone, otp, expiresAt });

    // Build message
    const message = `Your SportItUp OTP is ${otp}. It expires in 2 minutes.`;

    // Call Renflair SMS API
    const RENFLAIR_URL = process.env.RENFLAIR_API_URL;
    const RENFLAIR_KEY = process.env.RENFLAIR_API_KEY;
    const RENFLAIR_SENDER = process.env.RENFLAIR_SENDER || "SPORTUP";

    if (!RENFLAIR_URL || !RENFLAIR_KEY) {
      // If env missing, still return sessionId for dev testing (no SMS)
      console.warn("Renflair env missing, returning session for dev. Set RENFLAIR_API_URL and RENFLAIR_API_KEY for real SMS.");
      return new Response(JSON.stringify({ ok: true, sessionId }), { status: 200, headers:{ "Content-Type":"application/json" } });
    }

    // Example payload — **adapt this to Renflair docs**.
    // They may expect form-encoded data or query params, so change accordingly.
    const payload = {
      api_key: RENFLAIR_KEY,
      to: phone,
      sender: RENFLAIR_SENDER,
      message,
    };

    const renRes = await fetch(RENFLAIR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // read Renflair response for debugging
    const renJson = await renRes.text(); // parse text to avoid parse errors
    if (!renRes.ok) {
      console.error("Renflair error:", renRes.status, renJson);
      return new Response(JSON.stringify({ ok: false, error: "sms_failed", details: renJson }), { status: 502, headers:{ "Content-Type":"application/json" } });
    }

    // success — return sessionId to client
    return new Response(JSON.stringify({ ok: true, sessionId }), { status: 200, headers:{ "Content-Type":"application/json" } });
  } catch (err) {
    console.error("send-otp error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers:{ "Content-Type":"application/json" } });
  }
}
