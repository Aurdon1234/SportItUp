import twilio from "twilio";

export async function POST(req) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return new Response(JSON.stringify({ error: "Phone number required" }), { status: 400 });
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.verify.v2.services(process.env.TWILIO_VERIFY_SID).verifications.create({
      to: `+91${phone}`, // adjust if you want to support other countries
      channel: "sms",
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("OTP send failed:", error);
    return Response.json({ ok: false, error: error.message });
  }
}