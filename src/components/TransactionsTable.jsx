import React from "react";
import { AiOutlinePrinter } from "react-icons/ai";

const TransactionsTable = ({
  transactions,
  handlePrint,
  includeOpeningBalance,
  setIncludeOpeningBalance,
  loadingTotalBalance,
}) => (
  <div className="shadow-lg rounded-lg  ">
    <div className="flex items-center justify-between bg-[#E6D5B8] gap-4 px-3 md:px-6 py-3 rounded-t-lg">
      <h2 className="font-bold text-gray-700">Transactions</h2>
      <div className="flex items-center space-x-2 md:space-x-4">
        <label className="flex items-center text-xs md:text-sm font-bold text-gray-600">
          <input
            type="checkbox"
            checked={includeOpeningBalance}
            onChange={() => setIncludeOpeningBalance(!includeOpeningBalance)}
            className="mr-2"
            disabled={loadingTotalBalance}
          />
          Include Net Balance
        </label>
        <button
          onClick={handlePrint}
          className="flex items-center font-bold text-green-900 hover:text-green-800">
          <AiOutlinePrinter className="mr-2 w-10 h-10" />
          <span className="hidden md:block">Print</span>
        </button>
      </div>
    </div>
    <div className="md:w-full w-screen md:ml-0 md:pl-0 -ml-20 pl-20">
      <div className="h-96 w-full overflow-auto">
        <table className="min-w-full text-left bg-[#F5ECD9] text-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9] uppercase">
                Date
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9] uppercase">
                Type
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9] uppercase">
                Category
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9] uppercase">
                Payment Method
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9] uppercase">
                Remarks
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-[#F5ECD9] uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="border-b odd:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transaction.type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transaction.category.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transaction.paymentMethod.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transaction.remarks || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  ৳ {transaction.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default TransactionsTable;
