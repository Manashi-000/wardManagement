"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    googleId: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8000/api/v1/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Signup successful! You can now log in.");
      setLoading(false);

      // Redirect to login page after a short delay
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4f71ac] px-4 py-8">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

        {/* Left side image */}
        <div className="md:w-[60%] h-64 md:h-auto relative">
          <img
            src="https://www.collegenp.com/uploads/2019/11/Government-Employees.jpg"
            alt="Ward Management Theme"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold text-center px-4 drop-shadow-lg">
              Ward Management System
            </h1>
          </div>
        </div>

        {/* Right side signup form */}
        <div className="md:w-[40%] p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#003083] text-center mb-8">
            Admin Sign Up
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3e5b3f]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3e5b3f]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google ID
              </label>
              <input
                type="text"
                name="googleId"
                value={formData.googleId}
                onChange={handleChange}
                placeholder="Enter Google ID"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3e5b3f]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/avatar.png"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3e5b3f]"
              />
            </div>

            {/* Display error or success messages */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003083] text-white py-3 rounded-xl font-semibold text-lg hover:bg-[#002060] transition disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#003083] underline hover:text-[#020710]"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
