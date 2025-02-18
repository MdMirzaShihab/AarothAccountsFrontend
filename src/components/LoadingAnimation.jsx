import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingAnimation = ({ message = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col items-center">
        <AiOutlineLoading3Quarters
          className="text-purple-600 animate-spin text-6xl mb-4"
          aria-label="Loading spinner"
        />
        <p className="text-lg text-gray-700 font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
