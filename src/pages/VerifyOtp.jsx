import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postJSON } from "../api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const phone = state?.phone;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!phone) {
      toast.error("No phone number found");
      navigate("/register");
    }
  }, [phone, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleClear = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      return toast.error("Enter 6-digit OTP");
    }

    try {
      const data = await postJSON("/auth/verify", { phone, otp: code });

      if (data.success) {
        toast.success("OTP Verified!");
        localStorage.setItem("token", data.token);
        navigate("/update-profile", { state: { phone } });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  const resendOtp = async () => {
    setResending(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("OTP resent successfully.");
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (e) {
      toast.error("Server error. Please try again.");
    }
    setResending(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // or "smooth"
  }, []);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4" style={{ backgroundImage: "url('/bg4.jpg')" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-10 py-10 border border-green-100 text-center">
        {/* Header */}
        <h2 className="text-2xl font-bold text-green-700 mb-2">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter the 6-digit code sent to <span className="font-semibold">{phone}</span>
        </p>

        {/* OTP inputs */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              className="w-11 h-11 text-lg border border-green-200 rounded-lg text-center bg-green-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-shadow duration-300 shadow-sm focus:shadow-md"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {/* Resend */}
        <div className="flex justify-between items-center mb-4 text-xs text-gray-600">
          <span>Didn&apos;t receive the OTP?</span>
          <button
            className="text-green-600 font-semibold hover:underline disabled:text-gray-400"
            onClick={resendOtp}
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        {/* Verify button */}
        <button
          onClick={handleSubmit}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            otp.every((d) => d !== "")
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Verify OTP
        </button>

        {/* Clear */}
        <button
          onClick={handleClear}
          className="w-full mt-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:underline"
        >
          Clear OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
