"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
export default function OrganizationPage() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    establishedAt: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [organizations, setOrganizations] = useState([]);

  const fetchOrganizations = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/organizations/get-organizations");
    const data = await res.json();

    console.log("Raw response:", data);

    if (Array.isArray(data)) {
      setOrganizations(data);
    } else if (Array.isArray(data.data)) {
      setOrganizations(data.data);
    } else if (Array.isArray(data.organizations)) {
      setOrganizations(data.organizations);
    } else {
      setOrganizations([]);
    }
  } catch (error) {
    console.error("Error fetching organizations:", error);
    setOrganizations([]);
  }
};


  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create organization
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/organizations/create-organization",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Organization created successfully!");
        setFormData({
          name: "",
          image: "",
          description: "",
          establishedAt: "",
          latitude: "",
          longitude: "",
        });
        fetchOrganizations(); 
      } else {
        setMessage(data.message || "Error creating organization");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Delete organization
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/organizations/delete-organization/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        fetchOrganizations();
      }
    } catch (err) {
      console.error("Error deleting organization:", err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center py-12 px-6 relative overflow-hidden">
      {/* Background */}
      <img
        src="https://via.placeholder.com/1200x800?text=Background+1"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none"
        alt="bg1"
      />
      <img
        src="https://via.placeholder.com/1200x800?text=Background+2"
        className="absolute bottom-0 right-0 w-full h-full object-cover opacity-10 pointer-events-none"
        alt="bg2"
      />

      <div className="relative w-full max-w-6xl bg-blue-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-[#003083] font-sans mb-16">
        <div className="flex-1 p-10 md:p-16 flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-[#003083]">
            Add New Organization
          </h1>
          <p className="text-gray-600 mb-6">Fill in the details below</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              name="name"
              placeholder="Organization Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#4F6F52]"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#4F6F52]"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#4F6F52]"
            />
            <input
              type="date"
              name="establishedAt"
              value={formData.establishedAt}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[#4F6F52]"
            />
            <div className="flex gap-4">
              <input
                type="number"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
                step="any"
                className="border border-gray-300 p-3 rounded-xl flex-1 text-black focus:outline-none focus:ring-2 focus:ring-[#4F6F52]"
              />
              <input
                type="number"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
                step="any"
                className="border border-gray-300 p-3 rounded-xl flex-1 text-black focus:outline-none focus:ring-2 focus:ring-[#4F6F52]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#4F6F52] hover:bg-[#3e5b3f] transition-colors p-4 rounded-xl text-white font-semibold"
            >
              {loading ? "Submitting..." : "Create Organization"}
            </button>

            {message && (
              <p
                className={`mt-3 font-semibold ${
                  message.includes("successfully")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>

        {/* Live Preview */}
        <div className="flex-1 p-10 bg-gray-50 flex flex-col items-center justify-start gap-6">
          <h2 className="text-2xl font-bold text-[#003083]">Live Preview</h2>
          <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg relative">
            <img
              src={
                formData.image ||
                "https://via.placeholder.com/800x450?text=Organization+Preview"
              }
              alt="Organization Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-blue-100 bg-opacity-30 p-5 text-black">
              <h3 className="text-2xl font-bold">
                {formData.name || "Organization Name"}
              </h3>
              <p className="text-sm mt-1">
                {formData.description || "Organization description..."}
              </p>
              {formData.establishedAt && (
                <p className="text-xs mt-1">
                  Established:{" "}
                  {new Date(formData.establishedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-[#003083] mb-6">
          All Organizations
        </h2>
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Image</th>
              <th className="px-6 py-3 border-b">Established</th>
              <th className="px-6 py-3 border-b">Latitude</th>
              <th className="px-6 py-3 border-b">Longitude</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.length > 0 ? (
              organizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 border-b">{org.name}</td>
                  <td className="px-6 py-3 border-b">
                    <img
                      src={org.image}
                      alt={org.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-3 border-b">
                    {new Date(org.establishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 border-b">{org.latitude}</td>
                  <td className="px-6 py-3 border-b">{org.longitude}</td>
                  <td className="px-6 py-7 border-b flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() =>
                        alert("Update functionality not implemented yet")
                      }
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(org.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center px-6 py-4 text-gray-500"
                >
                  No organizations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
