"use client";
import { useEffect, useState } from "react";

export default function EventsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    organizationId: "",
    name: "",
    eventDescription: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch Organizations
  const fetchOrganizations = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/organizations/get-organizations");
      if (!res.ok) throw new Error("Failed to fetch organizations");
      const data = await res.json();
      setOrganizations(data.data || []);
    } catch (err) {
      console.error("❌ Error fetching organizations:", err);
      setError("Could not load organizations.");
    }
  };

  // ✅ Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/organizations/organization/get-events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error("❌ Error fetching events:", err);
      setError("Could not load events.");
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchEvents();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit Event
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/v1/organizations/organization/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to create event");
      }

      // ✅ Update UI instantly with new event
      setEvents((prev) => [result.data, ...prev]);

      // Reset form
      setForm({
        organizationId: "",
        name: "",
        eventDescription: "",
        createdAt: "",
      });
    } catch (err) {
      console.error("❌ Error creating event:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 mx-auto bg-blue-50 min-h-screen">
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-8 text-center text-[#003083]">
        📅 Events Management
      </h1>

      {/* Error */}
      {error && <p className="text-red-600 mb-6 text-center font-medium">{error}</p>}

      {/* Create Event Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl font-semibold text-[#003083]">➕ Create New Event</h2>

        <select
          name="organizationId"
          value={form.organizationId}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003083] outline-none"
          required
        >
          <option value="">Select Organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003083] outline-none"
          required
        />

        <textarea
          name="eventDescription"
          placeholder="Event Description"
          value={form.eventDescription}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003083] outline-none"
          rows="3"
          required
        />

        <input
          type="text"
          name="createdAt"
          placeholder="Date (e.g. 30th August, 2025)"
          value={form.createdAt}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003083] outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#003083] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "⏳ Creating..." : "✅ Create Event"}
        </button>
      </form>

      {/* Events List */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">📌 Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-600 italic">No events found.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="p-6 border rounded-2xl shadow-md bg-white hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-[#003083] mb-2">{ev.name}</h3>
                <p className="text-gray-700 mb-3"> {organizations.find((o) => o.id === ev.organizationId)?.name || "Unknown Org"}</p>
                <p className="text-gray-700 mb-3">{ev.eventDescription}</p>
                <p className="text-gray-500 text-sm">📅 {ev.createdAt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
