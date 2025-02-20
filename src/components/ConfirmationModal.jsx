import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-purple-50 rounded-lg shadow-[#8C644A] shadow-lg p-6 max-w-sm w-full">
        <p className="text-gray-800 text-lg">{message}</p>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            {" "}
            Cancel{" "}
          </button>{" "}
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            {" "}
            Confirm{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default ConfirmationModal;
