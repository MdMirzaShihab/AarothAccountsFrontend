import React, { useState } from "react";

import Nav from "../components/Nav";
const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false); // Toggle for submenu

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-purple-900 text-white h-screen text-[14px] w-60 transition-width duration-300`}>
        <Nav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {/* Navbar */}
        <div className="bg-purple-900 text-white px-4 py-2 flex justify-end font-bold items-center shadow-md">
          <button className=" font-bold ">logout</button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 bg-gray-200">
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
