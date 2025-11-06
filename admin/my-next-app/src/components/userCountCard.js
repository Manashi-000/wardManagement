"use client";

import { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi"; // Users icon

export default function UserCountCard() {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem("token"); // If your route is protected
        const res = await fetch("http://localhost:8000/api/v1/users/count", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user count");
        }

        const data = await res.json();
        setUserCount(data.count);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not fetch user count");
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  if (loading)
    return <div className="p-6 bg-white shadow-lg rounded-xl w-60 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-6 bg-red-100 text-red-700 shadow-lg rounded-xl w-60 text-center">
        {error}
      </div>
    );

  return (
    <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform w-60">
      {/* Icon */}
      <div className="p-4 bg-green-100 rounded-full mr-4">
        <FiUsers className="text-green-600 w-6 h-6" />
      </div>

      {/* Count Info */}
      <div>
        <h3 className="text-gray-500 font-medium">Total Users</h3>
        <p className="text-3xl font-bold text-[#003083]">{userCount}</p>
      </div>
    </div>
  );
}
