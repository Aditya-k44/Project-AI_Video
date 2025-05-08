import { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {},
      }
    );
  };

  const handleSendOTP = async () => {
    if (!phone) return alert("Enter a valid phone number");
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setStep("otp");
    } catch (err) {
      alert("Error sending OTP: " + err.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !confirmationResult) return;
    try {
      await confirmationResult.confirm(otp);
      navigate("/");
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 shadow rounded-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login with Phone</h1>
        {step === "phone" ? (
          <>
            <input
              className="border px-4 py-2 w-full mb-4 focus:outline-none focus:ring-0"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
            />
            <button
              onClick={handleSendOTP}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full focus:outline-none focus:ring-0 hover:text-white transition"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              className="border px-4 py-2 w-full mb-4 focus:outline-none focus:ring-0"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button
              onClick={handleVerifyOTP}
              className="bg-green-500 text-white px-4 py-2 rounded w-full focus:outline-none focus:ring-0 hover:text-white transition"
            >
              Verify OTP
            </button>
          </>
        )}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
