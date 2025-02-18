import React, { useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

const TransactionReportForm = ({
  filters,
  setFilters,
  categories,
  paymentMethods,
  fetchReport,
  loading,
  error,
  buttonText
}) => {
  useEffect(() => {
    // Set the default date range to one month
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    setFilters((prev) => ({
      ...prev,
      startDate: oneMonthAgo.toISOString().split("T")[0], 
      endDate: today.toISOString().split("T")[0],
    }));
  }, [setFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleDateChange = (name, date) => {
    // Format the date as YYYY-MM-DD for storage
    setFilters((prev) => ({
      ...prev,
      [name]: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const paymentMethodOptions = paymentMethods.map((method) => ({
    value: method._id,
    label: method.name,
  }));

  const typeOptions = [
    { value: "credit", label: "Credit" },
    { value: "debit", label: "Debit" },
  ];

  return (
    <div className="px-6 pt-6 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-purple-900">
            From
          </label>
          <DatePicker
            selected={filters.startDate ? new Date(filters.startDate) : null}
            onChange={(date) => handleDateChange("startDate", date)}
            dateFormat="dd/MM/yy"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2 focus:ring-purple-500 focus:border-purple-500"
            wrapperClassName="w-full" 
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-purple-900">
            To
          </label>
          <DatePicker
            selected={filters.endDate ? new Date(filters.endDate) : null}
            onChange={(date) => handleDateChange("endDate", date)}
            dateFormat="dd/MM/yy"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2 focus:ring-purple-500 focus:border-purple-500"
            wrapperClassName="w-full" 
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Type
          </label>
          <Select
            options={typeOptions}
            value={typeOptions.find((opt) => opt.value === filters.type)}
            onChange={(opt) => handleSelectChange("type", opt)}
            className="rounded p-0.5 block w-full"
            placeholder="Select Type"
            isClearable
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Payment Method
          </label>
          <Select
            options={paymentMethodOptions}
            value={paymentMethodOptions.find(
              (opt) => opt.value === filters.paymentMethod
            )}
            onChange={(opt) => handleSelectChange("paymentMethod", opt)}
            placeholder="Select Method"
            isClearable
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Account Head
          </label>
          <Select
            options={categoryOptions}
            value={categoryOptions.find(
              (opt) => opt.value === filters.category
            )}
            onChange={(opt) => handleSelectChange("category", opt)}
            placeholder="Select Category"
            isClearable
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-purple-900">
            Search Remarks
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Enter remarks"
            className="w-full p-1.5 border-gray-300 rounded shadow-sm focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
      <button
        onClick={fetchReport}
        className="w-full mt-6 mb-4 bg-purple-600 text-white py-2 px-4 rounded shadow-md hover:bg-purple-700 hover:shadow-purple-500 transition-all duration-300">
        {loading ? "Loading..." : `${buttonText}`}
      </button>
    </div>
  );
};

export default TransactionReportForm;
