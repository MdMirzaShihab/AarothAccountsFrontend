import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionReportForm from "./TransactionReportForm";
import ReportSummary from "./ReportSummary";
import TransactionsTable from "./TransactionsTable";
import { generatePDF } from "../utils/ReportGeneratorPDF";
import LoadingAnimation from "./LoadingAnimation";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../secrets";

const Report = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
    search: "",
  });
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactionsIncludingOpening, setTransactionsIncludingOpening] =
    useState(0);
  const [loadingTotalBalance, setLoadingTotalBalance] = useState(false);
  const [includeOpeningBalance, setIncludeOpeningBalance] = useState(false);

  const REPORT_API = `${BASE_URL}reports`;
  const TOTAL_BALANCE_API = `${BASE_URL}reports/total-balance`;
  const CATEGORY_API = `${BASE_URL}categories`;
  const PAYMENT_METHOD_API = `${BASE_URL}payment-methods`;

  useEffect(() => {
    // Fetch categories and payment methods on component mount
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(CATEGORY_API);
        const paymentMethodResponse = await axios.get(PAYMENT_METHOD_API);
        setCategories(categoryResponse.data);
        setPaymentMethods(paymentMethodResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(REPORT_API, {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate,
          type: filters.type,
          category: filters.category,
          paymentMethod: filters.paymentMethod,
          search: filters.search,
        },
      });
      const { transactions, totalDebit, totalCredit, totalBalance } =
        response.data;
      setTransactions(transactions);
      setTotalDebit(totalDebit);
      setTotalCredit(totalCredit);
      setTotalBalance(totalBalance);
      fetchTotalBalance();
    } catch (error) {
      setError("Error fetching report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalBalance = async () => {
    setLoadingTotalBalance(true);
    try {
      const response = await axios.get(TOTAL_BALANCE_API, {
        params: {
          endDate: filters.endDate,
        },
      });
      setTransactionsIncludingOpening(
        response.data.totalBalanceIncludingOpening
      );
    } catch (error) {
      console.error("Error fetching total balance:", error);
    } finally {
      setLoadingTotalBalance(false);
    }
  };

  const handlePrint = () => {
    generatePDF(
      transactions,
      totalDebit,
      totalCredit,
      totalBalance,
      includeOpeningBalance ? transactionsIncludingOpening : null
    );
  };

  return (
    <div className="pl-16 md:pl-0">
      <div className="bg-[#F5ECD9] max-w-7xl mx-auto mt-8 p-4 rounded-lg shadow-lg">
        <h1 className="text-3xl text-center text-[#8C644A] font-bold">
          Transaction Report
        </h1>
        <TransactionReportForm
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          paymentMethods={paymentMethods}
          fetchReport={fetchReport}
          loading={loading}
          buttonText="Generate Report"
          error={error}
        />
      </div>
      <ReportSummary
        totalDebit={totalDebit}
        totalCredit={totalCredit}
        totalBalance={totalBalance}
        transactionsIncludingOpening={transactionsIncludingOpening}
        loadingTotalBalance={loadingTotalBalance}
      />
      <div className=" max-w-7xl mx-auto">
        {loading ? (
          <LoadingAnimation message="Fetching data..." />
        ) : transactions.length > 0 ? (
          <TransactionsTable
            transactions={transactions}
            handlePrint={handlePrint}
            includeOpeningBalance={includeOpeningBalance}
            setIncludeOpeningBalance={setIncludeOpeningBalance}
            loadingTotalBalance={loadingTotalBalance}
          />
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No transactions available for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default Report;
