import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email: userEmail, otp });


      setMessage("Email verified successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
    } catch (error) {
      setMessage(error.response?.data.message || "Invalid OTP. Try again.");
    }
  };

  // Function to resend OTP with 60s lock
  const handleResendOTP = async () => {
    if (isDisabled) return;

    setIsDisabled(true);
    setMessage("Sending new OTP...");

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email: userEmail });
      setMessage("A new OTP has been sent to your email.");

      setTimeout(() => setIsDisabled(false), 60000); // Unlock resend after 60 seconds
    } catch (error) {
      setMessage("Error sending OTP. Try again later.");
      setIsDisabled(false);
    }
  };

  // Handle "I haven't received my code" message
  const handleNoCodeClick = () => {
    alert("Please try again in 5 minutes. In the meantime, monitor your inbox for your code.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-200 to-pink-300 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
        <p className="text-gray-700 text-sm">
          Please check your email for an OTP (One-Time PIN) and enter the code below:
        </p>

        {/* OTP Input */}
        <input
          type="text"
          placeholder="Enter one time PIN"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mt-4 p-3 border rounded-full text-center"
        />

        {/* Resend & Haven't Received Code */}
        <div className="mt-4 text-sm">
          <button
            onClick={handleResendOTP}
            disabled={isDisabled}
            className={`text-blue-600 ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
          >
            Send another code
          </button>
          <br />
          <button onClick={handleNoCodeClick} className="text-blue-600 hover:underline">
            I haven't received my code
          </button>
        </div>

        {/* Status Message */}
        {message && <p className="mt-3 text-sm text-red-500">{message}</p>}

        {/* Submit Button */}
        <button
          onClick={handleVerifyOTP}
          className="mt-6 w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-gradient-to-r from-yellow-300 to-pink-300 shadow-lg hover:scale-105 transition">
          ➝
        </button>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
