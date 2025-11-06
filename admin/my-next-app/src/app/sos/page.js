"use client";
import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const page = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmergency, setNewEmergency] = useState({
    public_service: "",
    contact: "",
    description: "",
    icon: "",
  });

  // Fetch emergencies from backend
  const fetchEmergencies = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/emergency/get-emergencies"
      );
      const result = await res.json();
      setEmergencies(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching emergencies:", error);
    }
  };

  // Save new emergency
  const saveEmergency = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/emergency/create-emergency",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEmergency),
        }
      );

      if (res.ok) {
        setNewEmergency({
          public_service: "",
          contact: "",
          description: "",
          icon: "",
        });
        setIsAdding(false);
        fetchEmergencies();
      }
    } catch (error) {
      console.error("Error creating emergency:", error);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this emergency contact?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/emergency/delete-emergency/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setEmergencies(emergencies.filter((e) => e.id !== id));
      } else {
        console.error("Failed to delete emergency");
      }
    } catch (error) {
      console.error("Error deleting emergency:", error);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editingEmergency, setEditingEmergency] = useState(null);

  const handleEdit = (emergency) => {
    setEditingEmergency(emergency);
    setIsEditing(true);
  };

  const saveUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/emergency/update-emergency/${editingEmergency.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingEmergency),
        }
      );

      if (res.ok) {
        setIsEditing(false);
        setEditingEmergency(null);
        fetchEmergencies(); // refresh list
      } else {
        console.error("Failed to update emergency");
      }
    } catch (error) {
      console.error("Error updating emergency:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">SOS Management</h1>
      <p className="text-gray-700 italic mb-4">
        Manage emergency contacts that users will see in the SOS page of the
        app.
      </p>
      <h1 className="text-[#003083] text-2xl font-bold">Emergency Contacts</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-[#003083] text-white rounded shadow hover:bg-blue-700"
        >
          ➕ Add Emergency Contact
        </button>
      </div>
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-[#96b3e5]">
          <tr>
            <th className="p-2">Icon</th>
            <th className="p-2">Public Service</th>
            <th className="p-2">Contact</th>
            <th className="p-2">Description</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {emergencies.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="p-2 flex justify-center">
                {e.icon ? (
                  <img src={e.icon} alt="icon" className="h-8 w-8" />
                ) : (
                  "—"
                )}
              </td>
              <td className="p-2">{e.public_service}</td>
              <td className="p-2">{e.contact}</td>
              <td className="p-2">{e.description}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(e)}
                  className="text-blue-600 px-2 py-1 rounded flex items-center gap-1"
                >
                  <FaEdit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-red-400 px-2 py-1 rounded flex items-center gap-1"
                >
                  <FaTrash size={16} /> Delete
                </button>
              </td>
            </tr>
          ))}

          {/* Edit Row */}
          {isEditing && editingEmergency && (
            <tr className="border-t bg-blue-50">
              <td className="p-2">
                <input
                  type="file"
                  accept=".svg"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append("icon", file);

                      const res = await fetch(
                        "http://localhost:8000/api/v1/emergency/upload-icon",
                        { method: "POST", body: formData }
                      );
                      const data = await res.json();
                      setEditingEmergency({
                        ...editingEmergency,
                        icon: data.url,
                      });
                    }
                  }}
                />
                {editingEmergency.icon && (
                  <img
                    src={editingEmergency.icon}
                    alt="icon"
                    className="h-8 w-8 mt-1"
                  />
                )}
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={editingEmergency.public_service}
                  onChange={(e) =>
                    setEditingEmergency({
                      ...editingEmergency,
                      public_service: e.target.value,
                    })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={editingEmergency.contact}
                  onChange={(e) =>
                    setEditingEmergency({
                      ...editingEmergency,
                      contact: e.target.value,
                    })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={editingEmergency.description}
                  onChange={(e) =>
                    setEditingEmergency({
                      ...editingEmergency,
                      description: e.target.value,
                    })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={saveUpdate}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ✅ Update
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingEmergency(null);
                  }}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  ❌ Cancel
                </button>
              </td>
            </tr>
          )}

          {/* Add Row */}
          {isAdding && (
            <tr className="border-t bg-blue-50">
              <td className="p-2">
                <input
                  type="file"
                  accept=".svg"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append("icon", file);

                      const res = await fetch(
                        "http://localhost:8000/api/v1/emergency/upload-icon",
                        { method: "POST", body: formData }
                      );
                      const data = await res.json();
                      setNewEmergency({ ...newEmergency, icon: data.url });
                    }
                  }}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="Public Service"
                  value={newEmergency.public_service}
                  onChange={(e) =>
                    setNewEmergency({
                      ...newEmergency,
                      public_service: e.target.value,
                    })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="Contact"
                  value={newEmergency.contact}
                  onChange={(e) =>
                    setNewEmergency({
                      ...newEmergency,
                      contact: e.target.value,
                    })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={newEmergency.description}
                  onChange={(e) =>
                    setNewEmergency({
                      ...newEmergency,
                      description: e.target.value,
                    })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={saveEmergency}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ✅ Save
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  ❌ Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default page;
