"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi"; // Icon from react-icons

export default function ActiveComplaintCountCard() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/v1/complaints/count", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch complaint count");

        const data = await res.json();
        setCount(data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCount();
  }, []);

  return (
    <Link href="/complaints">
      <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform cursor-pointer">
        {/* Icon */}
        <div className="p-4 bg-red-100 rounded-full mr-4">
          <FiAlertCircle className="text-red-600 w-6 h-6" />
        </div>

        {/* Count Info */}
        <div>
          <h3 className="text-gray-500 font-medium">Active Complaints</h3>
          <p className="text-3xl font-bold text-gray-800">{count}</p>
        </div>
      </div>
    </Link>
  );
}
