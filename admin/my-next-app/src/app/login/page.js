"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", googleId: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save JWT token locally (you can switch to cookies later)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "ADMIN") router.push("/");
      else router.push("/");

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4f71ac]">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full">

        {/* Left side image */}
        <div
          className="md:w-1/2 h-80 md:h-auto bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.collegenp.com/uploads/2019/11/Government-Employees.jpg')",
          }}
        >
          <div className="w-full h-full bg-black/25 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-4xl font-bold px-4 text-center">
              Ward Management System
            </h1>
          </div>
        </div>

        {/* Right side login form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#003083] text-center mb-8">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Show error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003083] text-white py-3 rounded-xl font-semibold text-lg hover:bg-[#002060] transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#003083] underline hover:text-[#020710]"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
