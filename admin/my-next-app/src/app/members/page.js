"use client";
import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Upload } from "lucide-react";

const baseUrl= Constants.expoConfig?.extra?.backendURL;

export default function MemberDetailPage() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    contact: "",
    classification: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${baseUrl}/get-members`);
      console.log("Fetch meabers reponse:", res)
      const result = await res.json();
      setMembers(result.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("position", formData.position);
    form.append("contactNumber", formData.contact);
    form.append("classification", formData.classification);
    if (formData.image) form.append("image", formData.image);

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${baseUrl}/update-member/${editingId}`
      : `${baseUrl}/create-member`;

    try {
      const res = await fetch(url, { method, body: form });
      if (!res.ok) throw new Error("Failed to save member");

      setFormData({
        name: "",
        position: "",
        contact: "",
        classification: "",
        image: null,
      });
      setPreview(null);
      setEditingId(null);
      fetchMembers();
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      position: member.position,
      contact: member.contactNumber,
      classification: member.classification,
      image: null,
    });
    setPreview(
      member.image ? `http://localhost:8000/uploads/${member.image}` : null
    );
    setEditingId(member.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`${baseUrl}/delete-member/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <div className="p-6 bg-blue-50">
      <h1 className="text-[#003083] text-2xl font-bold mb-4">👥 Member Details</h1>

      {/* Add / Edit Member Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-5 mb-6 border"
      >
        <h2 className="text-lg font-semibold mb-3">
          {editingId ? "Update Member" : "Add New Member"}
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded-lg p-2 w-full"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          {/* Position */}
          <input
            type="text"
            placeholder="Position"
            className="border rounded-lg p-2 w-full"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            required
          />

          {/* Contact */}
          <input
            type="text"
            placeholder="Contact Number"
            className="border rounded-lg p-2 w-full"
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            required
          />

          {/* Classification */}
          <select
            value={formData.classification}
            onChange={(e) =>
              setFormData({ ...formData, classification: e.target.value })
            }
            className="border rounded-lg p-2 w-full"
            required
          >
            <option value="">Select Classification</option>
            <option value="REPRESENTATIVE">REPRESENTATIVE</option>
            <option value="PUBLIC_SERVICE">PUBLIC_SERVICE</option>
          </select>

          {/* Image Upload */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-100">
            <Upload className="w-5 h-5 text-gray-500 mb-1" />
            <span className="text-sm text-gray-600">
              {formData.image ? formData.image.name : "Upload Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full border"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-[#003083] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          {editingId ? "Update Member" : "Add Member"}
        </button>
      </form>

      {/* Members Table */}
      <div className="overflow-x-auto bg-white border shadow-md rounded-2xl">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-blue-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Position</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Classification</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member, index) => (
                <tr key={member.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <img
                      src={
                        member.image
                          ? `http://localhost:8000/uploads/${member.image}`
                          : "/default-avatar.png"
                      }
                      alt={member.name}
                      className="w-12 h-12 object-cover rounded-full border"
                    />
                  </td>
                  <td className="p-3 font-medium">{member.name}</td>
                  <td className="p-3">{member.position}</td>
                  <td className="p-3">{member.contactNumber}</td>
                  <td className="p-3">{member.classification}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
