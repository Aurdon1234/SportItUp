// app/api/otp/verify-otp/route.js
const OTP_STORE = global.__OTP_STORE ||= new Map();

export async function POST(req) {
  try {
    const { sessionId, code } = await req.json();
    if (!sessionId || !code) return new Response(JSON.stringify({ ok: false, error: "missing params" }), { status: 400, headers:{ "Content-Type":"application/json" } });

    const rec = OTP_STORE.get(sessionId);
    if (!rec) return new Response(JSON.stringify({ ok: false, error: "session_not_found" }), { status: 400, headers:{ "Content-Type":"application/json" } });

    const { otp, phone, expiresAt } = rec;
    if (Date.now() > expiresAt) {
      OTP_STORE.delete(sessionId);
      return new Response(JSON.stringify({ ok: false, error: "expired" }), { status: 400, headers:{ "Content-Type":"application/json" } });
    }

    if (String(code).trim() !== String(otp).trim()) {
      return new Response(JSON.stringify({ ok: false, error: "invalid_code" }), { status: 400, headers:{ "Content-Type":"application/json" } });
    }

    // success — remove session
    OTP_STORE.delete(sessionId);

    // Optionally: persist "phone verified" in DB or send server event

    return new Response(JSON.stringify({ ok: true, phone }), { status: 200, headers:{ "Content-Type":"application/json" } });
  } catch (err) {
    console.error("verify-otp error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers:{ "Content-Type":"application/json" } });
  }
}
