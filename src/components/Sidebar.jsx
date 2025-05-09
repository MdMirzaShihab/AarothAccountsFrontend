import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import mpi from "../assets/LogoAaroth.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
    className={`bg-[#8C644A] h-full pt-20 p-2 transition-width duration-300 flex flex-col justify-between fixed lg:relative top-0 left-0 z-40 ${isOpen ? "w-64" : "w-16"}`}

    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-4">
        {isOpen && (
          <div className="flex items-center gap-2">
            <img src={mpi} alt="MPI Logo" className="h-10 w-10 bg-white rounded-xl p-1" />
            <span className="text-lg font-semibold text-white">Aaroth</span>
          </div>
        )}
        <button className="text-white" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 flex-1 text-[#F5ECD9] font-medium">
        <Link to="/dashboard" className={`hover:bg-[#D4A373] p-2 rounded transition ${isActive("/dashboard") ? "bg-[#E6D5B8] text-gray-700 font-bold" : ""}`}>
          {isOpen ? "Dashboard" : "📊"}
        </Link>
        <Link to="/transation" className={`hover:bg-[#D4A373] p-2 rounded transition ${isActive("/transation") ? "bg-[#E6D5B8] text-gray-700 font-bold" : ""}`}>
          {isOpen ? "Transactions" : "💰"}
        </Link>
        <Link to="/report" className={`hover:bg-[#D4A373] p-2 rounded transition ${isActive("/report") ? "bg-[#E6D5B8] text-gray-700 font-bold" : ""}`}>
          {isOpen ? "Reports" : "📑"}
        </Link>
        <Link to="/settings" className={`hover:bg-[#D4A373] p-2 rounded transition ${isActive("/settings") ? "bg-[#E6D5B8] text-gray-700 font-bold" : ""}`}>
          {isOpen ? "Settings" : "⚙️"}
        </Link>
      </nav>

      {isOpen && <div className="text-center text-sm text-gray-300">Aaroth &copy; 2025</div>}
    </div>
  );
};

export default Sidebar;
