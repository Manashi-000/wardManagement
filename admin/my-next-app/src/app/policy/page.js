"use client";
import { useEffect, useState } from "react";

export default function PolicyPage() {
  const [organizations, setOrganizations] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({
    organizationId: "",
    policyName: "",
    policyDescription: "",
    createAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingPolicyId, setEditingPolicyId] = useState(null);

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/organizations/get-organizations"
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch organizations");
      setOrganizations(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load organizations.");
    }
  };

  // Fetch policies
  const fetchPolicies = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/organizations/organization/get-policies"
      );
      const data = await res.json();
      if (!res.ok) {
        setPolicies([]);
        setError(data.message || "Failed to fetch policies");
        return;
      }
      setPolicies(data.policyExist || []);
    } catch (err) {
      console.error(err);
      setError("Could not load policies.");
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchPolicies();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or Update policy
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = editingPolicyId
        ? `http://localhost:8000/api/v1/organizations/organization/update-policies/${editingPolicyId}`
        : "http://localhost:8000/api/v1/organizations/organization/create-policies";

      const method = editingPolicyId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Operation failed");
        setLoading(false);
        return;
      }

      // Refresh list
      fetchPolicies();

      // Reset form
      setForm({
        organizationId: "",
        policyName: "",
        policyDescription: "",
        createAt: "",
      });
      setEditingPolicyId(null);
    } catch (err) {
      console.error(err);
      setError("Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  // Delete policy
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete this policy?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/organizations/organization/delete-policies/${id}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to delete policy");
        return;
      }
      fetchPolicies();
    } catch (err) {
      console.error(err);
      setError("Failed to delete policy.");
    }
  };

  // Fill form for editing
  const handleEdit = (policy) => {
    setForm({
      organizationId: policy.organizationId,
      policyName: policy.policyName,
      policyDescription: policy.policyDescription,
      createAt: policy.createAt.slice(0, 10), // format yyyy-mm-dd for input type=date
    });
    setEditingPolicyId(policy.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Group policies by organization
  const groupedPolicies = organizations.map((org) => ({
    org,
    policies: policies.filter((p) => p.organizationId === org.id),
  }));

  return (
    <div className="p-8 mx-auto bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#003083]">
        📄 Policy Management
      </h1>

      {error && (
        <p className="text-red-600 mb-6 text-center font-medium">{error}</p>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl font-semibold text-[#003083]">
          {editingPolicyId ? "✏️ Update Policy" : "➕ Create New Policy"}
        </h2>

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
          name="policyName"
          placeholder="Policy Title"
          value={form.policyName}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003083] outline-none"
          required
        />

        <textarea
          name="policyDescription"
          placeholder="Policy Description"
          value={form.policyDescription}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003083] outline-none"
          rows="3"
          required
        />

        <input
          type="date"
          name="createAt"
          value={form.createAt}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003083] outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#003083] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "⏳ Processing..." : editingPolicyId ? "✅ Update Policy" : "✅ Create Policy"}
        </button>
      </form>

      {/* Policy List */}
      <div className="mt-12">
        {groupedPolicies.map(({ org, policies }) => (
          <div key={org.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003083]">{org.name}</h2>
            {policies.length === 0 ? (
              <p className="text-gray-600 italic mb-4">No policies found.</p>
            ) : (
              <table className="w-full table-auto bg-white rounded-xl shadow-md overflow-hidden">
                <thead className="bg-blue-200 text-[#003083]">
                  <tr>
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50">
                      <td className="p-3 border">{p.policyName}</td>
                      <td className="p-3 border">{p.policyDescription}</td>
                      <td className="p-3 border">{p.createAt}</td>
                      <td className="p-3 border space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-400"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
