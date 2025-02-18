import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Dashboard from "./Dashboard";
import Transation from "./Transation";
import Report from "./Report";
import Settings from "./Settings";
import NotFound from "./NotFound";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen">
      {/* Fixed Topbar */}
      <Topbar />

      {/* Sidebar + Main Content Wrapper */}
      <div className="flex h-screen">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Main Content */}
        <div className={`flex flex-col flex-1 transition-all duration-300 `}>
          <div className="flex-1 overflow-y-auto pt-16 p-2">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transation" element={<Transation />} />
              <Route path="/report" element={<Report />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
