import React from "react";
import { useNavigate } from "react-router-dom";
import Clock from "./Clock";
import DateComponent from "./DateComponent";

const Topbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem("isLoggedIn");
        navigate("/");
      };
  return (
    <div className="fixed top-0 left-0 w-full h-16 z-50 bg-[#8C644A] p-4 flex justify-between items-center shadow-xl">

        <DateComponent />
        <Clock />
        <button
        onClick={handleLogout}
         className="bg-red-600 px-4 py-1 text-white rounded-lg hover:bg-red-700">
          Logout
        </button>

    </div>
  );
};

export default Topbar;
