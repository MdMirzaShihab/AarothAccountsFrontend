import React from "react";

const TodayDebit = ({
  debitAccounts,
  totalDebit,
  handleDelete,
  handleEdit,
}) => {
  const renderTableRows = (data) =>
    data.map((transaction) => (
      <tr
        key={transaction._id}
        className="bg-white border-b hover:bg-gray-50 odd:bg-blue-50">
        <td className="px-4 py-2">{transaction.category.name}</td>
        <td className="px-4 py-2 text-center">
          {transaction.paymentMethod.name}
        </td>
        <td className="px-4 py-2 text-end">
          {transaction.amount.toLocaleString()}
        </td>
        <td className="px-4 py-2 flex justify-center gap-2">
          <button
            onClick={() => handleEdit(transaction, transaction.type)}
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
            Edit
          </button>
          <button
            onClick={() => handleDelete(transaction._id, "debit")}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded">
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Today's Debits
      </h2>
      <div className="overflow-auto h-96">
        <table className="min-w-full text-sm text-left text-gray-600 border rounded-lg">
          <thead className="text-xs uppercase text-white bg-blue-500">
            <tr>
              <th className="px-4 py-2 sticky top-0 z-10 bg-blue-500">
                Account Head
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-blue-500">
                Payment Method
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-blue-500 text-end">
                Amount
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-blue-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {debitAccounts.length > 0 ? (
              renderTableRows(debitAccounts)
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center px-4 py-2 text-gray-500 italic">
                  No debit accounts available
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="2"
                className="px-4 py-2 font-bold bg-gray-100 text-gray-700 sticky bottom-0 z-10">
                Total Debit
              </td>
              <td className="px-4 py-2 font-bold bg-gray-100 text-gray-700 sticky bottom-0 z-10 text-end">
                ৳ {totalDebit.toLocaleString()}
              </td>
              <td
                colSpan="1"
                className="text-center py-2 sticky bottom-0 z-10 bg-gray-100"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TodayDebit;
