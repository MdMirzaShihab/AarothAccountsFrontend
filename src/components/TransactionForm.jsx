import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { format } from "date-fns";

const TransactionForm = ({
  formData,
  categories,
  paymentMethods,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
}) => {
  const typeOptions = [
    { value: "credit", label: "Credit" },
    { value: "debit", label: "Debit" },
  ];

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  const paymentMethodOptions = paymentMethods.map((method) => ({
    value: method._id,
    label: method.name,
  }));


  const handleDateChange = (date) => {
    handleInputChange({
      target: { name: "date", value: format(date, "yyyy-MM-dd") }, 
    });
  };

  return (
    <form onSubmit={handleSubmit} className=" rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Account Type */}
        <div className="">
          <label className="block mb-2 text-sm font-medium text-[#8C644A]">
            Account Type
          </label>
          <Select
            name="type"
            value={typeOptions.find((option) => option.value === formData.type)}
            onChange={(selectedOption) =>
              handleSelectChange(selectedOption, "type")
            }
            options={typeOptions}
            placeholder="Select Type"
            required
            isSearchable
            className="w-full"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "rgb(156 163 175)", // gray-400
                borderRadius: "0.375rem", // rounded-lg
                boxShadow: "none",
                "&:hover": { borderColor: "rgb(107 114 128)" }, // gray-600
              }),
            }}
          />
        </div>
        {/* Account Head */}
        <div className="">
          <label className="block mb-2 text-sm font-medium text-[#8C644A]">
            Account Head
          </label>
          <Select
            name="category"
            value={categoryOptions.find(
              (option) => option.value === formData.category
            )}
            onChange={(selectedOption) =>
              handleSelectChange(selectedOption, "category")
            }
            options={categoryOptions}
            placeholder="Select Head"
            isDisabled={!formData.type}
            isSearchable
            className="w-full"
            required
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "rgb(156 163 175)",
                borderRadius: "0.375rem",
                boxShadow: "none",
                "&:hover": { borderColor: "rgb(107 114 128)" },
              }),
            }}
          />
        </div>

        {/* Payment Method */}
        <div className="">
          <label className="block mb-2 text-sm font-medium text-[#8C644A]">
            Payment Method
          </label>
          <Select
            name="paymentMethod"
            value={paymentMethodOptions.find(
              (option) => option.value === formData.paymentMethod
            )}
            onChange={(selectedOption) =>
              handleSelectChange(selectedOption, "paymentMethod")
            }
            options={paymentMethodOptions}
            placeholder="Select Payment Method"
            required
            isSearchable
            className="w-full"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "rgb(156 163 175)",
                borderRadius: "0.375rem",
                boxShadow: "none",
                "&:hover": { borderColor: "rgb(107 114 128)" },
              }),
            }}
          />
        </div>

        {/* Date */}
        <div className="">
          <label className="block mb-2 text-sm font-medium text-[#8C644A]">
            Date
          </label>
          <DatePicker
            selected={formData.date ? new Date(formData.date) : null} // Use formData.date if it's available
            onChange={handleDateChange} // Update state when the date is changed
            dateFormat="dd/MM/yy" // Display format for users
            className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg block w-full p-2 focus:ring-[#D4A373] focus:border-[#D4A373]"
            wrapperClassName="w-full" 
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {/* Amount */}
        <div className="">
          <label className="block mb-2 text-sm font-medium text-[#8C644A]">
            Amount
          </label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-5 focus:ring-[#D4A373] focus:border-[#D4A373]"
            placeholder="Amount"
            name="amount"
            value={formData.amount || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Remarks */}
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-[#8C644A]">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks || ""}
            onChange={handleInputChange}
            rows="2"
            className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-[#D4A373] focus:border-[#D4A373]"
            placeholder="Write your thoughts here..."></textarea>
        </div>
      </div>
      {/* Submit Button */}
      <div className="col-span-1 md:col-span-1 flex justify-center items-center pt-5">
        <button
          type="submit"
          className="bg-[#8C644A] hover:bg-[#D4A373] text-white text-sm rounded-lg block w-full p-2.5 hover:shadow-[#D4A373] font-medium shadow-md transition-all duration-300">
          Save Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
