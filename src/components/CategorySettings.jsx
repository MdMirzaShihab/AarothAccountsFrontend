import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../components/ConfirmationModal";
import { API_BASE_URL } from "../secrets";

const CategorySettings = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("credit");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const CATEGORY_API = `${API_BASE_URL}categories`;

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API);
      setCategories(response.data);
      setFilteredCategories(response.data); // Initialize filtered list
    } catch (error) {
      toast.error(
        `Error fetching categories: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle create or update category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const response = await axios.put(
          `${CATEGORY_API}/${editingCategory._id}`,
          {
            type: categoryType,
            name: categoryName,
          }
        );
        toast.success(`Category updated successfully: ${response.data.name}`);
      } else {
        const response = await axios.post(CATEGORY_API, {
          type: categoryType,
          name: categoryName,
        });
        toast.success(`Category created successfully: ${response.data.name}`);
      }
      setCategoryName("");
      setCategoryType("credit");
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(
        `Error saving category: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    try {
      await axios.delete(`${CATEGORY_API}/${categoryToDelete._id}`);
      toast.success("Category deleted successfully.");
      setShowModal(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      toast.error(
        `Error deleting category: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryType(category.type);
  };

  // Open delete confirmation modal
  const confirmDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setShowModal(true);
  };

  // Handle search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  };

  return (
    <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
    <ToastContainer />

    {/* Form */}
    <form
      onSubmit={handleSaveCategory}
      className="bg-purple-200 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
        {editingCategory ? "Edit Category" : "Create Category"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Account Type
          </label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="categoryType"
                value="credit"
                checked={categoryType === "credit"}
                onChange={() => setCategoryType("credit")}
                className="text-blue-500 focus:ring-2 focus:ring-blue-300"
              />
              <span className="ml-2 text-sm text-gray-700">Credit</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="categoryType"
                value="debit"
                checked={categoryType === "debit"}
                onChange={() => setCategoryType("debit")}
                className="text-blue-500 focus:ring-2 focus:ring-blue-300"
              />
              <span className="ml-2 text-sm text-gray-700">Debit</span>
            </label>
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Category Name
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
            className="mt-2 w-full p-2 border-2 border-purple-300 shadow-md rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-end justify-center md:justify-start">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700">
            {editingCategory ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </form>

    {/* Category List */}
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Categories</h2>
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search categories..."
          className="w-full p-2 border-2 shadow-md shadow-purple-300 border-purple-200 rounded-lg focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto bg-purple-100 shadow-md">
        {/* Wrapper for the header and body */}
        <div className="max-h-96 overflow-y-auto">
          {/* Header */}
          <table className="min-w-full text-left text-gray-700">
            <thead className="bg-purple-200">
              <tr>
                <th className="px-4 py-2 sticky top-0 z-10 bg-purple-200">
                  Name
                </th>
                <th className="px-4 py-2 sticky top-0 z-10 bg-purple-200">
                  Type
                </th>
                <th className="px-4 py-2 text-center sticky top-0 z-10 bg-purple-200">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category._id} className="border-t odd:bg-gray-50">
                  <td className="px-4 py-2">{category.name}</td>
                  <td className="px-4 py-2 capitalize">{category.type}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => confirmDeleteCategory(category)}
                      className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCategories.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No categories found.
          </div>
        )}
      </div>
    </div>

    {/* Confirmation Modal */}
    {showModal && (
      <ConfirmationModal
        onCancel={() => setShowModal(false)}
        onConfirm={handleDeleteCategory}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
      />
    )}
  </div>
  );
};

export default CategorySettings;
