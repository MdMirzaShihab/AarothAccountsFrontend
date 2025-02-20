import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import LoadingAnimation from "./LoadingAnimation";
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineTransaction,
  AiOutlineNumber,
} from "react-icons/ai";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { BASE_URL } from "../secrets";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}dashboard/analytics/monthly`
        );
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalytics();
  }, []);

  const debitCategoryData = analytics
    ? {
        labels: analytics.debitByCategory.map((item) => item.category),
        datasets: [
          {
            label: "Debit Categories",
            data: analytics.debitByCategory.map((item) => item.total),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#66BB6A"],
          },
        ],
      }
    : {};

  const creditCategoryData = analytics
    ? {
        labels: analytics.creditByCategory.map((item) => item.category),
        datasets: [
          {
            label: "Credit Categories",
            data: analytics.creditByCategory.map((item) => item.total),
            backgroundColor: ["#4BC0C0", "#FF9F40", "#FF6384", "#9966FF"],
          },
        ],
      }
    : {};

  const debitCreditComparisonData = analytics
    ? {
        labels: ["Debits", "Credits"],
        datasets: [
          {
            label: "Amount",
            data: [analytics.totalDebits, analytics.totalCredits],
            backgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      }
    : {};

  return (
    <div className="pl-16 md:pl-0 -ml-16 md:-ml-0">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#8C644A] my-4">
        Dashboard for this Month
      </h2>
      <div className="max-w-7xl mx-auto">
        {!analytics ? (
          <LoadingAnimation message="Fetching data..." />
        ) : (
          <div className="grid gap-6">
            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-100 shadow rounded p-4 flex flex-col items-center">
                <h2 className="text-md font-semibold text-gray-700">
                  Total Credits
                </h2>
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  ৳ {analytics.totalCredits.toLocaleString()}
                </p>
                <AiOutlineArrowUp className="text-green-600 text-lg md:text-xl" />
              </div>
              <div className="bg-red-100 shadow rounded p-4 flex flex-col items-center">
                <h2 className="text-md font-semibold text-gray-700">
                  Total Debits
                </h2>
                <p className="text-xl md:text-2xl font-bold text-red-600">
                  ৳ {analytics.totalDebits.toLocaleString()}
                </p>
                <AiOutlineArrowDown className="text-red-600 text-lg md:text-xl" />
              </div>
              <div className="bg-yellow-100 shadow rounded p-4 flex flex-col items-center">
                <h2 className="text-md font-semibold text-gray-700">
                  Total Balance
                </h2>
                <p className="text-xl md:text-2xl font-bold text-yellow-600">
                  {(
                    analytics.totalCredits - analytics.totalDebits
                  ).toLocaleString()}
                </p>
                <AiOutlineTransaction className="text-yellow-600 text-lg md:text-xl" />
              </div>
              <div className="bg-orange-100 shadow rounded p-4 flex flex-col items-center">
                <h2 className="text-md font-semibold text-gray-700">
                  Total Transactions
                </h2>
                <p className="text-xl md:text-2xl font-bold text-orange-600">
                  {analytics.totalTransactions}
                </p>
                <AiOutlineNumber className="text-orange-600 text-lg md:text-xl" />
              </div>
            </div>

            {/* Chart Section */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Debit Pie Chart */}
              <div className="bg-white shadow rounded p-4 flex flex-col flex-1">
                <h2 className="text-md font-semibold mb-2 text-center">
                  Debit Breakdown by Category
                </h2>
                <div className="w-full aspect-[2/1]">
                  <Pie
                    data={debitCategoryData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
              {/* Credit Pie Chart */}
              <div className="bg-white shadow rounded p-4 flex flex-col flex-1">
                <h2 className="text-md font-semibold mb-2 text-center">
                  Credit Breakdown by Category
                </h2>
                <div className="w-full aspect-[2/1]">
                  <Pie
                    data={creditCategoryData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
            {/* Bar Chart */}
            <div className="bg-white shadow rounded max-w-3xl mx-auto flex flex-col">
              <h2 className="text-md font-semibold mb-2 text-center">
                Total Debits vs Credits
              </h2>
              <div className="w-full aspect-[2/1]">
                <Bar
                  data={debitCreditComparisonData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
