import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionForm from "./TransactionForm";
import TodayDebit from "./TodayDebit";
import TodayCredit from "./TodayCredit";
import Nav from "../components/Nav";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import Clock from "./Clock";
import { API_BASE_URL } from "../secrets";
import DateComponent from "./DateComponent";

const Transaction = () => {
  const navigate = useNavigate();
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
  const [debitAccounts, setDebitAccounts] = useState([]);
  const [creditAccounts, setCreditAccounts] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [filterSaveTrigger, setFilterSaveTrigger] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [deleteTransaction, setDeleteTransaction] = useState({
    id: null,
    type: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(`${API_BASE_URL}categories`);
        const paymentMethodResponse = await axios.get(
          `${API_BASE_URL}payment-methods`
        );
        setCategories(categoryResponse.data);
        setPaymentMethods(paymentMethodResponse.data);

        const cashPaymentMethod = paymentMethodResponse.data.find(
          (method) => method.name.toLowerCase() === "cash"
        );
        if (cashPaymentMethod) {
          setFormData((prevData) => ({
            ...prevData,
            paymentMethod: cashPaymentMethod._id,
          }));
        }
      } catch (error) {
        toast.error("Error fetching categories or payment methods.");
      }
    };

    fetchData();
  }, [formData.type]);

  const fetchData = async (url, setter, totalSetter, totalKey) => {
    try {
      const response = await axios.get(url);
      setter(response.data.transactions || []);
      totalSetter(response.data[totalKey] || 0);
    } catch (error) {
      toast.error(`Error fetching data from ${url}.`);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(
          `${API_BASE_URL}today-reports/debits/today`,
          setDebitAccounts,
          setTotalDebit,
          "totalDebit"
        ),
        fetchData(
          `${API_BASE_URL}today-reports/credits/today`,
          setCreditAccounts,
          setTotalCredit,
          "totalCredit"
        ),
      ]);
    };

    fetchAllData();
  }, [filterSaveTrigger]);

  const handleDelete = async () => {
    try {
      const url = `${API_BASE_URL}today-reports/${deleteTransaction.type}s/today/${deleteTransaction.id}`;
      await axios.delete(url);
      toast.success("Transaction deleted successfully.");
      setFilterSaveTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to delete transaction.");
    } finally {
      setShowModal(false);
    }
  };

  const confirmDelete = (id, type) => {
    setDeleteTransaction({ id, type });
    setShowModal(true);
  };

  const handleEdit = (transaction, type) => {
    setFormData({
      type,
      category: transaction.category._id,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod._id,
      remarks: transaction.remarks,
      date: transaction.date.split("T")[0],
    });
    setIsEditing(true);
    setEditId(transaction._id);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEditing
      ? `${API_BASE_URL}today-reports/${formData.type}s/today/${editId}`
      : `${API_BASE_URL}transactions`;
    try {
      if (isEditing) {
        await axios.put(url, formData);
        toast.success("Transaction updated successfully!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(url, formData);
        toast.success("Transaction created successfully!");
      }
      setFormData({
        type: "",
        category: "",
        amount: "",
        paymentMethod: "",
        remarks: "",
        date: new Date().toISOString().split("T")[0],
      });
      setFilterSaveTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to create or update transaction.");
    }
  };

  return (
    <div className="pl-16 md:pl-0 ">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className=" space-y-6">
        {/* Confirmation Modal */}
        {showModal && (
          <ConfirmationModal
            onConfirm={handleDelete}
            onCancel={() => setShowModal(false)}
            message="Are you sure you want to delete this transaction?"
          />
        )}
        {/* Transaction Form */}
        <div className="bg-purple-200 shadow-lg mt-6 max-w-7xl mx-auto shadow-purple-300 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-4">
            Create or Edit Transaction
          </h2>
          <TransactionForm
            formData={formData}
            categories={categories}
            paymentMethods={paymentMethods}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSubmit={handleSubmit}
          />
        </div>

        {/* Today’s Debit and Credit Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="bg-red-100 shadow-lg rounded-lg shadow-red-300 p-6 h-full">
            <TodayCredit
              creditAccounts={creditAccounts}
              totalCredit={totalCredit}
              handleDelete={(id) => confirmDelete(id, "credit")}
              handleEdit={(transaction) => handleEdit(transaction, "credit")}
            />
          </div>
          <div className="bg-blue-100 shadow-lg rounded-lg shadow-blue-300 p-6 h-full">
            <TodayDebit
              debitAccounts={debitAccounts}
              totalDebit={totalDebit}
              handleDelete={(id) => confirmDelete(id, "debit")}
              handleEdit={(transaction) => handleEdit(transaction, "debit")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
