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
    if (!phone) {
      return new Response(JSON.stringify({ ok: false, error: "missing phone" }), { status: 400, headers: { "Content-Type":"application/json" } });
    }

    // debug logs (temporary)
    console.log("RENFLAIR_API_URL:", process.env.RENFLAIR_API_URL);
    console.log("RENFLAIR_API_KEY loaded:", !!process.env.RENFLAIR_API_KEY);
    console.log("RENFLAIR_SENDER:", process.env.RENFLAIR_SENDER);

    const otp = generateOtp(6);
    const sessionId = randomBytes(12).toString("hex");
    const expiresAt = Date.now() + OTP_TTL_MS;
    OTP_STORE.set(sessionId, { phone, otp, expiresAt });

    // DEV: print OTP to logs so you can test immediately (remove in production)
    console.log(`[DEV] OTP for ${phone} = ${otp} (session ${sessionId})`);

    const RENFLAIR_URL = process.env.RENFLAIR_API_URL;
    const RENFLAIR_KEY = process.env.RENFLAIR_API_KEY;
    const RENFLAIR_SENDER = process.env.RENFLAIR_SENDER || "SPORTUP";

    if (!RENFLAIR_URL || !RENFLAIR_KEY) {
      // Running without Renflair configured -> return session for dev testing.
      return new Response(JSON.stringify({ ok: true, sessionId, note: "dev-mode: renflair not configured" }), { status: 200, headers: { "Content-Type":"application/json" } });
    }

    // Build payload exactly as Renflair expects.
    // From your ZIP we saw the V1 syntax uses query params: https://sms.renflair.in/V1.php?API=...&PHONE=...&OTP=...
    const url = new URL(RENFLAIR_URL);
    url.searchParams.set("API", RENFLAIR_KEY);
    url.searchParams.set("PHONE", phone);
    url.searchParams.set("OTP", otp);
    // If Renflair requires sender or template params, add them:
    // url.searchParams.set("SENDER", RENFLAIR_SENDER);

    console.log("Calling Renflair:", url.toString());

    const renRes = await fetch(url.toString(), { method: "GET" });
    const renText = await renRes.text();
    console.log("Renflair HTTP status:", renRes.status, "body:", renText.slice(0, 200));

    // Basic success check: policy depends on Renflair. If renRes.ok and response contains success token, accept it.
    if (!renRes.ok) {
      console.error("Renflair returned non-OK:", renRes.status, renText);
      return new Response(JSON.stringify({ ok: false, error: "sms_provider_error", details: renText }), { status: 502, headers: { "Content-Type":"application/json" } });
    }

    // Some gateways return "OK" or numeric code in body. Adjust the check below if Renflair returns JSON.
    const lower = (renText || "").toLowerCase();
    if (lower.includes("error") || lower.includes("failed") || lower.includes("invalid")) {
      console.error("Renflair reported failure:", renText);
      return new Response(JSON.stringify({ ok: false, error: "sms_provider_rejected", details: renText }), { status: 502, headers: { "Content-Type":"application/json" } });
    }

    // success
    return new Response(JSON.stringify({ ok: true, sessionId }), { status: 200, headers: { "Content-Type":"application/json" } });
  } catch (err) {
    console.error("send-otp unexpected error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { "Content-Type":"application/json" } });
  }
}
