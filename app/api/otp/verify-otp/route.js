// import twilio from "twilio";

// export async function POST(req) {
//   try {
//     const { phone, code } = await req.json();
//     if (!phone || !code) {
//       return new Response(JSON.stringify({ error: "Phone and code required" }), { status: 400 });
//     }

//     const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//     const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
//       .verificationChecks.create({
//         to: `+91${phone}`,
//         code,
//       });

//     if (verification.status === "approved") {
//       return Response.json({ ok: true });
//     }

//     return Response.json({ ok: false, error: "Invalid or expired OTP" });
//   } catch (error) {
//     console.error("OTP verification failed:", error);
//     return Response.json({ ok: false, error: error.message });
//   }
// }

// app/api/verify-otp/route.js
const OTP_STORE = global.__OTP_STORE ||= new Map();

export async function POST(req) {
  try {
    const { sessionId, code } = await req.json();
    if (!sessionId || !code) return new Response(JSON.stringify({ ok: false, error: "missing params" }), { status: 400 });

    const rec = OTP_STORE.get(sessionId);
    if (!rec) return new Response(JSON.stringify({ ok: false, error: "session not found or expired" }), { status: 400 });

    const { otp, phone, expiresAt } = rec;
    if (Date.now() > expiresAt) {
      OTP_STORE.delete(sessionId);
      return new Response(JSON.stringify({ ok: false, error: "expired" }), { status: 400 });
    }

    if (String(code).trim() !== String(otp).trim()) {
      return new Response(JSON.stringify({ ok: false, error: "invalid code" }), { status: 400 });
    }

    // verification success - remove session
    OTP_STORE.delete(sessionId);

    // optionally: mark phone as verified in your booking session or DB here

    return new Response(JSON.stringify({ ok: true, phone }), { status: 200 });
  } catch (err) {
    console.error("verify-otp error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
