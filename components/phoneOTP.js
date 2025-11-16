// components/PhoneOTP.jsx
"use client";
import React, { useEffect, useState } from "react";

/**
 * Props:
 * - initialPhone (string)
 * - onVerified(phone) : callback
 */
export default function PhoneOTP({ initialPhone = "", onVerified }) {
  const [phone, setPhone] = useState(initialPhone || "");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let t;
    if (resendTimer > 0) t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  async function sendOtp() {
    setError("");
    if (!phone) { setError("Enter a phone number"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const raw = await res.text();
      if (!res.ok) {
        console.error("send-otp failed", res.status, raw);
        const parsed = raw ? JSON.parse(raw) : null;
        throw new Error(parsed?.error || raw || "Failed to send OTP");
      }
      const data = raw ? JSON.parse(raw) : null;
      setSessionId(data?.sessionId || null);
      setOtpSent(true);
      setResendTimer(30);
    } catch (err) {
      console.error("sendOtp error", err);
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError("");
    if (!sessionId) { setError("No OTP session. Please send OTP first."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, code: otp }),
      });
      const raw = await res.text();
      if (!res.ok) {
        console.error("verify failed", res.status, raw);
        const parsed = raw ? JSON.parse(raw) : null;
        throw new Error(parsed?.error || raw || "Verification failed");
      }
      const data = raw ? JSON.parse(raw) : null;
      setVerified(true);
      onVerified?.(data?.phone || phone);
    } catch (err) {
      console.error("verifyOtp error", err);
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (resendTimer > 0) return;
    setSessionId(null); setOtp(""); setOtpSent(false);
    await sendOtp();
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700"></label>
      <div className="flex gap-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 99999 99999"
          className="w-full px-3 py-2 border border-gray-200 rounded-md"
        />
        {!otpSent ? (
          <button onClick={sendOtp} disabled={loading} className="bg-green-600 text-white px-3 py-2 rounded">
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
            <button onClick={verifyOtp} disabled={loading} className="bg-blue-600 text-white px-3 py-2 rounded">
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button onClick={resend} disabled={resendTimer > 0} className={`px-3 py-2 rounded ${resendTimer>0 ? "bg-gray-300":"bg-yellow-500"}`}>
              {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend"}
            </button>
          </>
        )}
      </div>
      {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
      {verified && <div className="text-sm text-green-600">Phone verified ✓</div>}
    </div>
  );
}
