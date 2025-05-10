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
  Title,
} from "chart.js";
import { BASE_URL } from "../secrets";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}dashboard/analytics/monthly`);
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getChartColors = (count) => {
    const baseColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#8C644A', '#66BB6A'
    ];
    return baseColors.slice(0, count);
  };

  const renderKPICard = (title, value, isPositive, icon) => (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className={`p-2 rounded-lg ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold mt-2">
        ৳ {value.toLocaleString()}
      </p>
      <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <AiOutlineArrowUp className="mr-1" /> : <AiOutlineArrowDown className="mr-1" />}
        <span>This month</span>
      </div>
    </div>
  );

  return (
    <div className="pl-16 md:pl-0 -ml-16 md:-ml-0">
     <h2 className="text-2xl md:text-3xl font-bold text-center text-[#8C644A] my-4">Monthly Dashboard</h2>
      
      {isLoading ? (
        <LoadingAnimation message="Loading dashboard data..." />
      ) : analytics ? (
        <div className="max-w-7xl mx-auto">
          {/* KPI Cards */}
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
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Debit Pie Chart */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-medium text-[#8C644A] mb-4">Debit by Account Head</h3>
              <div className="h-64">
                <Pie
                  data={{
                    labels: analytics.debitByCategory.map(item => item.category),
                    datasets: [{
                      data: analytics.debitByCategory.map(item => item.total),
                      backgroundColor: getChartColors(analytics.debitByCategory.length),
                      borderWidth: 1,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `৳ ${context.raw.toLocaleString()}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Credit Pie Chart */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-medium text-[#8C644A] mb-4">Credit by Account Head</h3>
              <div className="h-64">
                <Pie
                  data={{
                    labels: analytics.creditByCategory.map(item => item.category),
                    datasets: [{
                      data: analytics.creditByCategory.map(item => item.total),
                      backgroundColor: getChartColors(analytics.creditByCategory.length),
                      borderWidth: 1,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `৳ ${context.raw.toLocaleString()}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Debit vs Credit Bar Chart */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-medium text-[#8C644A] mb-4">Debits vs Credits</h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: ['Debits', 'Credits'],
                  datasets: [{
                    label: 'Amount (৳)',
                    data: [analytics.totalDebits, analytics.totalCredits],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    borderWidth: 1,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `৳ ${value.toLocaleString()}`
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `৳ ${context.raw.toLocaleString()}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-red-500">Failed to load dashboard data. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;