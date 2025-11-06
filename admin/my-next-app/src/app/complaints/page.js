"use client";

import React, { useEffect, useState } from "react";

// Reusable Complaint Card
function ComplaintCard({ complaint, handleResponseChange, handleStatusChange, handleSendResponse, submitting }) {
  // Choose badge color for status
  const getStatusColor = (status) => {
    if (status === "RESOLVED") return "bg-green-100 text-green-800";
    if (status === "INPROGRESS") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2 text-sm md:text-sm">
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        {/* Complaint Info */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-[#003083]">{complaint.subject}</h2>
          <p className="text-gray-700 mt-1">{complaint.description}</p>
          <div className="mt-1 space-y-1">
            <p>
              <span className="font-semibold">Category:</span> {complaint.category}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className={`font-semibold px-2 py-0.5 rounded-full ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Location:</span> {complaint.taggedLocation}
            </p>
          </div>
        </div>

        {/* Images */}
        <div className="flex gap-2 flex-wrap">
          {complaint.images && complaint.images.length > 0 ? (
            complaint.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`complaint-${idx}`}
                className="w-24 h-24 object-cover rounded-md shadow-sm"
              />
            ))
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md text-xs">
              No Image
            </div>
          )}
        </div>
      </div>

      {/* Admin Response Section */}
      <div className="flex flex-col md:flex-row gap-2 items-start">
        <textarea
          value={complaint.response || ""}
          onChange={(e) => handleResponseChange(complaint.id, e.target.value)}
          placeholder="Write your response..."
          className="border border-gray-300 rounded-md p-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6F52]"
        />
        <select
          value={complaint.status}
          onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
          className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6F52]"
        >
          <option value="REGISTERED">REGISTERED</option>
          <option value="INPROGRESS">INPROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
        <button
          onClick={() => handleSendResponse(complaint)}
          disabled={submitting}
          className="bg-[#4F6F52] hover:bg-[#3e5b3f] text-white rounded-md px-4 py-1 font-medium text-sm transition-colors disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Backend message */}
      {complaint.backendMessage && (
        <div
          className={`mt-2 px-3 py-1 rounded-md text-xs ${
            complaint.backendMessageType === "success"
              ? "bg-green-100 text-green-800"
              : complaint.backendMessageType === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {complaint.backendMessage}
        </div>
      )}
    </div>
  );
}

export default function AdminComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/complaints/get-complaints");
        const data = await res.json();

        if (res.ok) {
          setComplaints(
            data.data.map((c) => ({ ...c, backendMessage: "", backendMessageType: "" })) || []
          );
        } else {
          console.error("Failed to fetch complaints:", data.message);
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleResponseChange = (id, value) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, response: value } : c))
    );
  };

  const handleStatusChange = (id, value) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: value } : c))
    );
  };

  const handleSendResponse = async (complaint) => {
    try {
      setSubmitting(true);
      const res = await fetch(
        `http://localhost:8000/api/v1/complaints/${complaint.id}/respond`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ response: complaint.response, status: complaint.status }),
        }
      );
      const data = await res.json();

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaint.id
            ? {
                ...c,
                backendMessage: data.message || "Updated",
                backendMessageType: res.ok ? "success" : "error",
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error sending response:", error);
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaint.id
            ? { ...c, backendMessage: "Network error", backendMessageType: "error" }
            : c
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm md:text-base font-medium text-gray-600">
        Loading complaints...
      </div>
    );
  }

  const resolvedComplaints = complaints.filter((c) => c.status === "RESOLVED");
  const pendingComplaints = complaints.filter((c) => c.status !== "RESOLVED");

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8 font-sans text-sm md:text-sm">
      <h1 className="text-2xl md:text-3xl font-bold text-[#003083] mb-4">Admin Complaints</h1>

      {/* Pending Section */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2 underline">Pending / In Progress</h2>
      {pendingComplaints.length === 0 ? (
        <p className="text-gray-600 text-center mb-4">No pending complaints.</p>
      ) : (
        pendingComplaints.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            handleResponseChange={handleResponseChange}
            handleStatusChange={handleStatusChange}
            handleSendResponse={handleSendResponse}
            submitting={submitting}
          />
        ))
      )}

      {/* Resolved Section */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mt-6 mb-2 underline">Resolved Complaints</h2>
      {resolvedComplaints.length === 0 ? (
        <p className="text-gray-600 text-center">No resolved complaints.</p>
      ) : (
        resolvedComplaints.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            handleResponseChange={handleResponseChange}
            handleStatusChange={handleStatusChange}
            handleSendResponse={handleSendResponse}
            submitting={submitting}
          />
        ))
      )}
    </div>
  );
}
