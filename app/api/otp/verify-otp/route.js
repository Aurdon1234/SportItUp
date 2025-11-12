import twilio from "twilio";

export async function POST(req) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return new Response(JSON.stringify({ error: "Phone and code required" }), { status: 400 });
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code,
      });

    if (verification.status === "approved") {
      return Response.json({ ok: true });
    }

    return Response.json({ ok: false, error: "Invalid or expired OTP" });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return Response.json({ ok: false, error: error.message });
  }
}