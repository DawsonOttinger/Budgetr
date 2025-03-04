import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleInitial: "",
    email: "",
    password: "",
    confirmPassword: "",
    receivePromos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);

      localStorage.setItem("userEmail", formData.email);

      navigate("/verify-email");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-200 to-pink-300 px-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-8 flex flex-col md:flex-row">
        {/* Left Side: Form */}
        <div className="w-full md:w-2/3 p-6">
          <h2 className="text-center text-2xl font-bold mb-4">Create your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border rounded-full text-center"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border rounded-full text-center"
                required
              />
              <input
                type="text"
                name="middleInitial"
                placeholder="M. I. (Optional)"
                value={formData.middleInitial}
                onChange={handleChange}
                className="w-16 p-3 border rounded-full text-center"
              />
            </div>

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
              placeholder="Password (Minimum 8 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-full text-center"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-full text-center"
              required
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="receivePromos"
                checked={formData.receivePromos}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label className="text-sm">
                If you would like to receive promotional emails, please check this box (optional)
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              type="button"
              className="w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-gradient-to-r from-yellow-300 to-pink-300 shadow-lg hover:scale-105 transition">
              ➝
            </button>
          </form>
        </div>

        {/* Right Side: Info Panel */}
        <div className="w-full md:w-1/3 p-6 flex flex-col justify-center border-l">
          <h2 className="text-xl font-bold mb-2">Let's get to know you!</h2>
          <p className="text-gray-700 text-sm">
            Complete the information to the left to get started! We're glad you're here!
          </p>

          <div className="mt-6 text-center">
            <p className="text-gray-700 text-sm">Already a member?</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 mt-2 bg-gradient-to-r from-yellow-300 to-pink-300 text-black rounded-full shadow-md hover:scale-105 transition">
              Login ➝
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

