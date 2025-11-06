"use client";
import React, { useState, useEffect } from "react";

export default function WardPostPage() {
  const [formData, setFormData] = useState({
    postname: "",
    postDescription: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/admins/get-posts");
      const data = await res.json();
      if (res.ok) setPosts(data.posts || data.data || []);
      else console.error(data.message);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Handle form field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle multiple image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  // ✅ Handle create / update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("postname", formData.postname);
      data.append("postDescription", formData.postDescription);
      formData.images.forEach((img) => data.append("images", img));

      const url = editingPost
        ? `http://localhost:8000/api/v1/admins/update-post/${editingPost.id}`
        : "http://localhost:8000/api/v1/admins/create-post";

      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, { method, body: data });
      const result = await res.json();

      if (res.ok) {
        setMessage(
          editingPost
            ? "✅ Post updated successfully!"
            : "✅ Post created successfully!"
        );
        setFormData({ postname: "", postDescription: "", images: [] });
        setPreviewImages([]);
        setEditingPost(null);
        setShowForm(false); // 👈 hide form after submit
        fetchPosts();
      } else {
        setMessage(result.message || "Error creating/updating post");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit post
  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true); // 👈 show form on edit
    setFormData({
      postname: post.postname,
      postDescription: post.postDescription,
      images: [],
    });

    const urls =
      post.image?.map((img) =>
        img.startsWith("http")
          ? img
          : `http://localhost:8000/${img.replace(/\\/g, "/")}`
      ) || [];
    setPreviewImages(urls);
  };

  // ✅ Delete post
  const handleDelete = async (id) => {
    if (
      !confirm(
        "🗑️ Are you sure you want to delete this post?\nThis action cannot be undone!"
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/admins/delete-post/${id}`,
        { method: "DELETE" }
      );
      const result = await res.json();

      if (res.ok) {
        setMessage("🗑️ Post deleted successfully!");
        fetchPosts();
      } else {
        setMessage(result.message || "Error deleting post");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error");
    }
  };

  // ✅ Add new post button handler
  const handleAddNew = () => {
    setEditingPost(null);
    setShowForm(true); // 👈 show form
    setFormData({ postname: "", postDescription: "", images: [] });
    setPreviewImages([]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center py-12 px-6 gap-10">
      {/* Header */}
      <div className="flex justify-between w-full max-w-6xl items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#003083]">
            Ward Posts Management
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            📢 Share the latest ward events, announcements, or community updates
            with citizens.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          ➕ Add New Post
        </button>
      </div>

      {/* ✅ Form + Preview (Only shown when showForm is true) */}
      {showForm && (
        <div className="w-full max-w-6xl bg-blue-50 rounded-2xl shadow-lg p-10 flex flex-col md:flex-row gap-10">
          {/* Form */}
          <div className="flex-1 flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="postname"
                placeholder="Post Name"
                value={formData.postname}
                onChange={handleChange}
                required
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                name="postDescription"
                placeholder="Post Description"
                value={formData.postDescription}
                onChange={handleChange}
                required
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <div>
                <label className="font-semibold text-[#003083]">
                  Upload Images
                </label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2 rounded-lg mt-2 w-full"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#003083] hover:bg-[#0040b0] text-white font-semibold py-3 px-6 rounded-lg mt-4 transition-all"
                >
                  {loading
                    ? "Submitting..."
                    : editingPost
                    ? "Update Post"
                    : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg mt-4 transition-all"
                >
                  Cancel
                </button>
              </div>

              {message && (
                <p
                  className={`mt-2 font-semibold ${
                    message.includes("✅") || message.includes("🗑️")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Live Preview */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-[#003083]">Live Preview</h2>
            <h3 className="text-xl font-semibold">
              {formData.postname || "Post Name"}
            </h3>
            <p>{formData.postDescription || "Post Description..."}</p>

            <div className="flex gap-2 overflow-x-auto">
              {previewImages.length > 0 ? (
                previewImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                ))
              ) : (
                <img
                  src="https://via.placeholder.com/200x150?text=Image+Preview"
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Post History Table */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 overflow-x-auto">
        <h2 className="text-2xl font-bold text-[#003083] mb-6">
          🕓 Post History
        </h2>

        {posts.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-200 text-[#003083]">
                <th className="p-3 border">#</th>
                <th className="p-3 border">Post Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Images</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={post.id} className="bg-blue-50 hover:bg-blue-100">
                  <td className="p-3 border text-center">{index + 1}</td>
                  <td className="p-3 border font-semibold">{post.postname}</td>
                  <td className="p-3 border">{post.postDescription}</td>
                  <td className="p-3 border">
                    <div className="flex gap-2 overflow-x-auto">
                      {post.image?.map((img, idx) => (
                        <img
                          key={idx}
                          src={
                            img.startsWith("http")
                              ? img
                              : `http://localhost:8000/${img.replace(/\\/g, "/")}`
                          }
                          alt={`${post.postname}-${idx}`}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 border text-sm text-gray-600">
                    {new Date(post.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">No posts available.</p>
        )}
      </div>
    </div>
  );
}
