import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../components/ConfirmationModal";
import { BASE_URL } from "../secrets";

const PaymentSettings = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);
  const [paymentMethodName, setPaymentMethodName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);

  const PAYMENT_METHOD_API = `${BASE_URL}payment-methods`;

  // Fetch payment methods
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(PAYMENT_METHOD_API);
      setPaymentMethods(response.data);
      setFilteredPaymentMethods(response.data); // Initialize filtered list
    } catch (error) {
      toast.error(
        `Error fetching payment methods: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle create or update payment method
  const handleSavePaymentMethod = async (e) => {
    e.preventDefault();
    try {
      if (editingPaymentMethod) {
        const response = await axios.put(
          `${PAYMENT_METHOD_API}/${editingPaymentMethod._id}`,
          { name: paymentMethodName }
        );
        toast.success(`Payment method updated: ${response.data.name}`);
      } else {
        const response = await axios.post(PAYMENT_METHOD_API, {
          name: paymentMethodName,
        });
        toast.success(`Payment method created: ${response.data.name}`);
      }
      setPaymentMethodName("");
      setEditingPaymentMethod(null);
      fetchPaymentMethods();
    } catch (error) {
      toast.error(
        `Error saving payment method: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle delete payment method
  const handleDeletePaymentMethod = async () => {
    try {
      await axios.delete(`${PAYMENT_METHOD_API}/${paymentMethodToDelete._id}`);
      toast.success("Payment method deleted successfully.");
      setShowModal(false);
      setPaymentMethodToDelete(null);
      fetchPaymentMethods();
    } catch (error) {
      toast.error(
        `Error deleting payment method: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle edit payment method
  const handleEditPaymentMethod = (method) => {
    setEditingPaymentMethod(method);
    setPaymentMethodName(method.name);
  };

  // Open delete confirmation modal
  const confirmDeletePaymentMethod = (method) => {
    setPaymentMethodToDelete(method);
    setShowModal(true);
  };

  // Handle search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = paymentMethods.filter((method) =>
      method.name.toLowerCase().includes(query)
    );
    setFilteredPaymentMethods(filtered);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
      <ToastContainer />

      {/* Form */}
      <form
        onSubmit={handleSavePaymentMethod}
        className="bg-[#F5ECD9] p-6 rounded-lg shadow-md">
        <h2 className="text-xl text-center font-semibold mb-4 text-gray-700">
          {editingPaymentMethod
            ? "Edit Payment Method"
            : "Create Payment Method"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Name Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Payment Method
            </label>
            <input
              type="text"
              value={paymentMethodName}
              onChange={(e) => setPaymentMethodName(e.target.value)}
              placeholder="Enter payment method name"
              required
              className="mt-2 w-full p-2 border-2 border-[#E6D5B8] shadow-md rounded-lg focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-end justify-center md:justify-start">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700">
              {editingPaymentMethod ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </form>

      {/* Payment Method List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Payment Methods
        </h2>
        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search payment methods..."
            className="w-full p-2 border-2 shadow-md shadow-[#E6D5B8] border-[#F5ECD9] rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="bg-[#F5ECD9] shadow-md">
          {/* Wrapper for the header and body */}
          <div className=" shadow-md h-96 overflow-y-auto">
            {/* Table Header */}
            <table className="min-w-full text-left text-gray-700 bg-[#F5ECD9]">
              <thead>
                <tr>
                  <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9]">
                    Name
                  </th>
                  <th className="px-4 py-2 text-center sticky top-0 z-10 bg-[#F5ECD9]">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Scrollable Table Body */}

              <tbody>
                {filteredPaymentMethods.map((method) => (
                  <tr key={method._id} className="border-t odd:bg-gray-100">
                    <td className="px-4 py-2">{method.name}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEditPaymentMethod(method)}
                        className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => confirmDeletePaymentMethod(method)}
                        className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No Payment Methods Found */}
            {filteredPaymentMethods.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No payment methods found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this payment method?"
          onConfirm={handleDeletePaymentMethod}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PaymentSettings;
