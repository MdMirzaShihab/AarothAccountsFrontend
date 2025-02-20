import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../components/ConfirmationModal";
import TransactionForm from "./TransactionForm";
import TransactionReportForm from "./TransactionReportForm";
import { BASE_URL } from "../secrets";
import LoadingAnimation from "./LoadingAnimation";

const TransactionSettings = () => {
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
    search: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    paymentMethod: "",
    remarks: "",
    date: "",
  });

  const REPORT_API = `${BASE_URL}reports`;
  const CATEGORY_API = `${BASE_URL}categories`;
  const PAYMENT_METHOD_API = `${BASE_URL}payment-methods`;

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(REPORT_API, {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate,
          type: filters.type,
          category: filters.category,
          paymentMethod: filters.paymentMethod,
          search: filters.search,
        },
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      setError("Error fetching report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoryResponse, paymentMethodResponse] = await Promise.all([
          axios.get(CATEGORY_API),
          axios.get(PAYMENT_METHOD_API),
        ]);
        setCategories(categoryResponse.data);
        setPaymentMethods(paymentMethodResponse.data);
      } catch (error) {
        toast.error("Failed to fetch data.");
      }
    };

    fetchInitialData();
    fetchReport();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: selectedOption ? selectedOption.value : "",
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_URL}transactions/${editId}`;
      await axios.put(url, formData);
      toast.success("Transaction updated successfully!");
      fetchReport();
      setIsEditing(false);
      setEditId(null);
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update transaction.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}transactions/${deleteTransactionId}`);
      toast.success("Transaction deleted successfully.");
      fetchReport();
    } catch (error) {
      toast.error("Failed to delete transaction.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteTransactionId(id);
    setShowDeleteModal(true);
  };

  return (
    <div className=" md:w-full w-screen md:ml-0 md:pl-0 -ml-20 pl-24 p-4">
      <ToastContainer />
      <div className="bg-gray-100 rounded-lg max-w-7xl mx-auto shadow-lg ">
        {showDeleteModal && (
          <ConfirmationModal
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
            message="Are you sure you want to delete this transaction?"
          />
        )}
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
                  onClick={() => setShowEditModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative bg-[#F5ECD9] rounded-lg shadow-lg z-20">
          <TransactionReportForm
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            paymentMethods={paymentMethods}
            fetchReport={fetchReport}
            loading={loading}
            buttonText="View Transactions"
            error={error}
          />
        </div>
      </div>
      <div className="mt-6 max-w-7xl mx-auto rounded-xl shadow-md">
  <div className="overflow-auto h-96">
    <table className="w-full min-w-max text-left text-gray-700 bg-[#F5ECD9]">
      <thead>
        <tr>
          <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9]">Type</th>
          <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9]">Category</th>
          <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9]">Amount</th>
          <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9]">Payment Method</th>
          <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9]">Date</th>
          <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9]">Remarks</th>
          <th className="px-4 py-2 text-center sticky top-0 z-10 bg-[#F5ECD9]">Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction._id} className="border-t odd:bg-gray-50">
            <td className="px-4 py-2">{transaction.type}</td>
            <td className="px-4 py-2">{transaction.category.name}</td>
            <td className="px-4 py-2">{transaction.amount}</td>
            <td className="px-4 py-2">{transaction.paymentMethod.name}</td>
            <td className="px-4 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
            <td className="px-4 py-2">{transaction.remarks}</td>
            <td className="px-4 py-2 text-center space-x-2">
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(transaction)}>
                <FaEdit />
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={() => confirmDelete(transaction._id)}>
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {transactions.length === 0 && (
      <div className="text-center py-4 text-gray-500">No transactions found.</div>
    )}
  </div>
</div>

    </div>
  );
};

export default TransactionSettings;
