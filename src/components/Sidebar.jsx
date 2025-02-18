import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import mpi from "../assets/mpi.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
    className={`bg-purple-900 h-full pt-20 p-2 transition-width duration-300 flex flex-col justify-between fixed lg:relative top-0 left-0 z-40 ${isOpen ? "w-64" : "w-16"}`}

    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-4">
        {isOpen && (
          <div className="flex items-center gap-2">
            <img src={mpi} alt="MPI Logo" className="h-10 w-10" />
            <span className="text-lg font-semibold text-white">MPI</span>
          </div>
        )}
        <button className="text-white" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 flex-1 text-purple-100 font-medium">
        <Link to="/dashboard" className={`hover:bg-purple-800 p-2 rounded transition ${isActive("/dashboard") ? "bg-purple-500" : ""}`}>
          {isOpen ? "Dashboard" : "📊"}
        </Link>
        <Link to="/transation" className={`hover:bg-purple-800 p-2 rounded transition ${isActive("/transation") ? "bg-purple-500" : ""}`}>
          {isOpen ? "Transactions" : "💰"}
        </Link>
        <Link to="/report" className={`hover:bg-purple-800 p-2 rounded transition ${isActive("/report") ? "bg-purple-500" : ""}`}>
          {isOpen ? "Reports" : "📑"}
        </Link>
        <Link to="/settings" className={`hover:bg-purple-800 p-2 rounded transition ${isActive("/settings") ? "bg-purple-500" : ""}`}>
          {isOpen ? "Settings" : "⚙️"}
        </Link>
      </nav>

      {isOpen && <div className="text-center text-sm text-gray-300">NexxVantage &copy; 2025</div>}
    </div>
  );
};

export default Sidebar;
