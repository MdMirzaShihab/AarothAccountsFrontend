import React from "react";

const TodayCredit = ({
  creditAccounts,
  totalCredit,
  handleDelete,
  handleEdit,
}) => {
  const renderTableRows = (data) =>
    data.map((transaction) => (
      <tr
        key={transaction._id}
        className="bg-white border-b hover:bg-gray-50 odd:bg-red-50">
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
            onClick={() => handleDelete(transaction._id, "credit")}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded">
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Today's Credit
      </h2>
      <div className="overflow-auto h-96">
        <table className="min-w-full text-sm text-left text-gray-600 border rounded-lg">
          <thead className="text-xs uppercase text-white bg-red-500">
            <tr>
              <th className="px-4 py-2 sticky top-0 z-10 bg-red-500">
                Account Head
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-red-500">
                Payment Method
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-red-500 text-end">
                Amount
              </th>
              <th className="px-4 py-2 sticky top-0 z-10 bg-red-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {creditAccounts.length > 0 ? (
              renderTableRows(creditAccounts)
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center px-4 py-2 text-gray-500 italic">
                  No credit accounts available
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="2"
                className="px-4 py-2 font-bold bg-gray-100 text-gray-700 sticky bottom-0 z-10">
                Total Credit
              </td>
              <td className="px-4 py-2 font-bold bg-gray-100 text-gray-700 sticky bottom-0 z-10 text-end">
                ৳ {totalCredit.toLocaleString()}
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

export default TodayCredit;
