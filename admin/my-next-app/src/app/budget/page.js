"use client";
import { useEffect, useState } from "react";

export default function BudgetPage() {
  const [organizations, setOrganizations] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({
    organizationId: "",
    name: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingBudgetId, setEditingBudgetId] = useState(null);

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

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/organizations/organization/get-budgets"
      );
      const data = await res.json();
      if (!res.ok) {
        setBudgets([]);
        setError(data.message || "Failed to fetch budgets");
        return;
      }
      setBudgets(data.budgetExist || []);
    } catch (err) {
      console.error(err);
      setError("Could not load budgets.");
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchBudgets();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or Update Budget
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = editingBudgetId
        ? `http://localhost:8000/api/v1/organizations/organization/update-budget/${editingBudgetId}`
        : "http://localhost:8000/api/v1/organizations/organization/create-budget";

      const method = editingBudgetId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to save budget");

      fetchBudgets();

      // Reset form
      setForm({ organizationId: "", name: "", amount: "" });
      setEditingBudgetId(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete budget
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete this budget?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/organizations/organization/delete-budget/${id}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete budget");
      fetchBudgets();
    } catch (err) {
      console.error(err);
      setError("Failed to delete budget.");
    }
  };

  // Edit budget
  const handleEdit = (budget) => {
    setForm({
      organizationId: budget.organizationId,
      name: budget.name,
      amount: budget.amount,
    });
    setEditingBudgetId(budget.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Group budgets by organization
  const groupedBudgets = organizations.map((org) => ({
    org,
    budgets: budgets.filter((b) => b.organizationId === org.id),
  }));

  return (
    <div className="p-8 mx-auto bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#003083]">
        💰 Budget Management
      </h1>

      {error && <p className="text-red-600 mb-6 text-center font-medium">{error}</p>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl font-semibold text-[#003083]">
          {editingBudgetId ? "✏️ Update Budget" : "➕ Create New Budget"}
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
          name="name"
          placeholder="Budget Name (e.g. Marketing Q1 2025)"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003083] outline-none"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Annual Budget Amount(रु)"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003083] outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#003083] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading
            ? "⏳ Processing..."
            : editingBudgetId
            ? "✅ Update Budget"
            : "✅ Create Budget"}
        </button>
      </form>

      {/* Budget List */}
      <div className="mt-12">
        {groupedBudgets.map(({ org, budgets }) => (
          <div key={org.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#003083]">{org.name}</h2>
            {budgets.length === 0 ? (
              <p className="text-gray-600 italic mb-4">No budgets found.</p>
            ) : (
              <table className="w-full table-auto bg-white rounded-xl shadow-md overflow-hidden">
                <thead className="bg-blue-200 text-[#003083]">
                  <tr>
                    <th className="p-3 border">Budget Name</th>
                    <th className="p-3 border">Amount (₹)</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((b) => (
                    <tr key={b.id} className="hover:bg-blue-50">
                      <td className="p-3 border">{b.name}</td>
                      <td className="p-3 border">{b.amount}</td>
                      <td className="p-3 border space-x-2">
                        <button
                          onClick={() => handleEdit(b)}
                          className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-400"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
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
