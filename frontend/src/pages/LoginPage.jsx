import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("No account found for this E-mail address");
        } else if (error.response.status === 401) {
          setError("Your email and/or password was incorrect. Please try again");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert("Please enter your email first to reset your password.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email: formData.email });
      localStorage.setItem("resetEmail", formData.email);
      navigate("/verify-email");
    } catch (error) {
      setError("No account found for this E-mail address");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-200 to-pink-300 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-full text-center"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-full text-center"
            required
          />

          <button type="button" onClick={handleForgotPassword} className="text-blue-600 text-sm hover:underline">
            Forgot Password
          </button>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          {/* Submit with Enter or click */}
          <button
            type="submit"
            className="mt-6 w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-gradient-to-r from-yellow-300 to-pink-300 shadow-lg hover:scale-105 transition">
            ➝
          </button>
        </form>

        <div className="mt-6 text-sm">
          <p>New here?</p>
          <button onClick={() => navigate("/register")} className="text-blue-600 hover:underline">
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;