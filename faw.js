import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../components/ConfirmationModal";
import { API_BASE_URL } from "../secrets";
import TransactionForm from "./TransactionForm";

const TransactionSettings = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    paymentMethod: "",
    remarks: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);

  // Fetch categories, payment methods, and transactions
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoryResponse, paymentMethodResponse, transactionResponse] =
          await Promise.all([
            axios.get(`${API_BASE_URL}categories`),
            axios.get(`${API_BASE_URL}payment-methods`),
            axios.get(`${API_BASE_URL}transactions`),
          ]);
        setCategories(categoryResponse.data);
        setPaymentMethods(paymentMethodResponse.data);
        setTransactions(transactionResponse.data);
      } catch (error) {
        toast.error("Failed to fetch data.");
      }
    };

    fetchInitialData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? (value ? parseFloat(value) : "") : value,
    });
  };

  const handleSelectChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });
  };

  // Handle edit
  const handleEdit = (transaction) => {
    setFormData({
      type: transaction.type,
      category: transaction.category._id,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod._id,
      remarks: transaction.remarks,
      date: transaction.date.split("T")[0],
    });
    setIsEditing(true);
    setEditId(transaction._id);
    setShowEditModal(true);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${API_BASE_URL}transactions/${editId}`;
      await axios.put(url, formData);
      toast.success("Transaction updated successfully!");

      // Refresh transactions
      const response = await axios.get(`${API_BASE_URL}transactions`);
      setTransactions(response.data);

      setIsEditing(false);
      setEditId(null);
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update transaction.");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}transactions/${deleteTransactionId}`);
      toast.success("Transaction deleted successfully.");

      // Refresh transactions
      const response = await axios.get(`${API_BASE_URL}transactions`);
      setTransactions(response.data);
    } catch (error) {
      toast.error("Failed to delete transaction.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setDeleteTransactionId(id);
    setShowDeleteModal(true);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
      <ToastContainer />

      {showDeleteModal && (
        <ConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          message="Are you sure you want to delete this transaction?"
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-7xl w-full">
            <h2 className="text-2xl font-semibold mb-4">Edit Transaction</h2>
            <TransactionForm
              formData={formData}
              categories={categories}
              paymentMethods={paymentMethods}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleSubmit={handleSubmit}
            />
            <div className="mt-4 text-right">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Transactions</h2>

        <div className="bg-purple-100 shadow-md">
          <div className="h-96 overflow-y-auto">
            <table className="min-w-full text-left text-gray-700">
              <thead className="bg-purple-200">
                <tr>
                  <th className="px-4 py-2 sticky top-0 z-10 bg-purple-200">
                    Type
                  </th>
                  <th className="px-4 py-2 sticky top-0 z-10 bg-purple-200">
                    Category
                  </th>
                  <th className="px-4 py-2 sticky top-0 z-10 bg-purple-200">
                    Amount
                  </th>
                  <th className="px-4 py-2 sticky top-0 z-10 bg-purple-200">
                    Payment Method
                  </th>
                  <th className="px-4 py-2 sticky top-0 z-10 bg-purple-200">
                    Date
                  </th>
                  <th className="px-4 py-2 sticky top-0 z-10 bg-purple-200">
                    Remarks
                  </th>
                  <th className="px-4 py-2 text-center sticky top-0 z-10 bg-purple-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-t odd:bg-gray-50">
                    <td className="px-4 py-2">{transaction.type}</td>
                    <td className="px-4 py-2">{transaction.category.name}</td>
                    <td className="px-4 py-2">{transaction.amount}</td>
                    <td className="px-4 py-2">
                      {transaction.paymentMethod.name}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-2">{transaction.remarks}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(transaction)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => confirmDelete(transaction._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No transactions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionSettings;
