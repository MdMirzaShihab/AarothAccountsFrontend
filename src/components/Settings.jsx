import React, { useState } from "react";
import CategorySettings from "./CategorySettings";
import PaymentSettings from "./PaymentSettings";
import TransactionSettings from "./TransactionSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("category");

  const renderContent = () => {
    if (activeTab === "category") {
      return <CategorySettings />;
    } else if (activeTab === "payment") {
      return <PaymentSettings />;
    } else if (activeTab === "transaction") {
      return <TransactionSettings />;
    }
  };

  return (
    <div className="pl-16 md:pl-0">
      {/* Tabs */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-center">
          <button
            className={`px-4 py-2 md:rounded-s-lg ${
              activeTab === "category"
                ? "bg-[#8C644A] text-white font-bold"
                : "bg-[#F5ECD9] text-gray-800 border-2 border-[#8C644A]"
            }`}
            onClick={() => setActiveTab("category")}>
            Account Head
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "payment"
                ? "bg-[#8C644A] text-white font-bold"
                : "bg-[#F5ECD9] text-gray-800 border-x-2 md:border-y-2 border-[#8C644A]"
            }`}
            onClick={() => setActiveTab("payment")}>
            Payment Options
          </button>
          <button
            className={`px-4 py-2 md:rounded-e-lg ${
              activeTab === "transaction"
                ? "bg-[#8C644A] text-white font-bold"
                : "bg-[#F5ECD9] text-gray-800 border-2 border-[#8C644A]"
            }`}
            onClick={() => setActiveTab("transaction")}>
            Transactions
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default Settings;
