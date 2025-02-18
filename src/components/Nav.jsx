import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import mpi from "../assets/mpi.png";

const Nav = () => {
  const [activeTab, setActiveTab] = useState(""); // State to track active tab
  const location = useLocation(); // Hook to get current path

  // Update active tab when the path changes
  React.useEffect(() => {
    setActiveTab(location.pathname); // Set the active tab based on the current URL
  }, [location]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-purple-900 text-white h-screen text-[14px] w-60 transition-width duration-300 flex flex-col justify-between`}>
        <div>
          <div className="flex-1 flex flex-row m-3">
            <img src={mpi} className="w-12 h-12" alt="MPI Logo" />
            {/* Navbar */}
            <div className="bg-purple-900 text-white px-4 py-2 flex items-center">
              <h1 className="text-lg font-semibold">MPI</h1>
            </div>
          </div>

          <nav>
            <ul className="space-y-0">
              <li>
                <Link
                  to="/dashboard"
                  className={`block p-4 hover:bg-purple-800 ${
                    activeTab === "/dashboard" ? "bg-purple-500" : ""
                  }`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/transation"
                  className={`block p-4 hover:bg-purple-800 ${
                    activeTab === "/transation" ? "bg-purple-500" : ""
                  }`}>
                  Transactions
                </Link>
              </li>
              <li>
                <Link
                  to="/report"
                  className={`block p-4 hover:bg-purple-800 ${
                    activeTab === "/report" ? "bg-purple-500" : ""
                  }`}>
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`block p-4 hover:bg-purple-800 ${
                    activeTab === "/settings" ? "bg-purple-500" : ""
                  }`}>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Branding at the bottom */}
        <div className="text-center text-gray-400 text-xs p-4">
          NX-Vantage &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Main Content */}
    </div>
  );
};

export default Nav;
