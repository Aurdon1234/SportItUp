// components/PhoneOTP.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { initFirebase } from "@/lib/firebaseClient";

/**
 * Props:
 * - initialPhone (optional) : string
 * - onVerified(phone) : callback when verification success
 * - allowedCountryPrefix (optional) : default "+91"
 */
export default function PhoneOTP({ initialPhone = "", onVerified, allowedCountryPrefix = "+91" }) {
  // firebase auth (client-only)
  const auth = typeof window !== "undefined" ? initFirebase() : null;

  // local state
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // refs for recaptcha & confirmation result
  const recaptchaRef = useRef(null);
  const confirmationRef = useRef(null);

  // initialize reCAPTCHA safely
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!auth) return;

    // Avoid double init
    if (!recaptchaRef.current) {
      try {
        // signature: RecaptchaVerifier(authOrWidgetId, containerOrParams, auth???) - v10 uses (auth, containerId, params)
        recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
        // render may throw if reCAPTCHA cannot load; catch to avoid crash
        recaptchaRef.current.render().catch(() => {});
      } catch (e) {
        // fallback if older firebase import path required - try the alternate signature
        try {
          // eslint-disable-next-line no-undef
          recaptchaRef.current = new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth);
          recaptchaRef.current.render().catch(() => {});
        } catch (ee) {
          console.error("recaptcha init failed:", ee);
        }
      }
    }
    // cleanup not needed — firebase manages it
  }, [auth]);

  // countdown for resend
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const normalizePhone = (p) => {
    const cleaned = p.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) return cleaned;
    return allowedCountryPrefix + cleaned.replace(/^0+/, "");
  };

  async function sendOtp() {
    setError("");
    if (!phone || phone.length < 6) {
      setError("Enter a valid phone number.");
      return;
    }
    if (!auth || !recaptchaRef.current) {
      setError("Auth not initialized. Reload page.");
      return;
    }
    setLoading(true);
    try {
      const formatted = normalizePhone(phone);
      // signInWithPhoneNumber uses the RecaptchaVerifier instance
      const result = await signInWithPhoneNumber(auth, formatted, recaptchaRef.current);
      confirmationRef.current = result;
      setOtpSent(true);
      setResendTimer(30); // 30s cooldown before resend
    } catch (err) {
      console.error("sendOtp error", err);
      setError((err && err.message) || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError("");
    if (!confirmationRef.current) {
      setError("Please request OTP first.");
      return;
    }
    if (!otp || otp.trim().length < 3) {
      setError("Enter OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await confirmationRef.current.confirm(otp);
      // res.user contains user info; user.phoneNumber is the number
      setOtpVerified(true);
      if (onVerified) onVerified(res.user?.phoneNumber || normalizePhone(phone));
    } catch (err) {
      console.error("verifyOtp error", err);
      setError((err && err.message) || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return;
    // Clear previous confirmation
    confirmationRef.current = null;
    setOtp("");
    setOtpSent(false);
    await sendOtp();
  };

  return (
    <div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <div className="flex gap-2">
          <input
            aria-label="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
            placeholder="e.g. 9876543210"
          />
          {!otpSent ? (
            <button
              onClick={sendOtp}
              disabled={loading}
              className="bg-green-600 text-white px-3 py-2 rounded"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                aria-label="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border rounded px-3 py-2 w-28"
                placeholder="OTP"
              />
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={`px-3 py-2 rounded ${resendTimer > 0 ? "bg-gray-300" : "bg-yellow-500"}`}
              >
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend"}
              </button>
            </div>
          )}
        </div>

        {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
        {otpVerified && <div className="text-sm text-green-600">Phone verified ✓</div>}
      </div>

      {/* invisible recaptcha mountpoint required by Firebase */}
      <div id="recaptcha-container" />
    </div>
  );
}
