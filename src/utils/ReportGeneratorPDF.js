import jsPDF from "jspdf";
import mpi from "../assets/mpi.png";

export const generatePDF = (
  transactions,
  totalDebit,
  totalCredit,
  totalBalance,
  transactionsIncludingOpening = null
) => {
  const includeOpeningBalance = transactionsIncludingOpening !== null;
  const doc = new jsPDF("landscape");

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  let startY = 10;
  let pageNumber = 1;
  const headerSpacing = 40;
  const cellHeight = 10;

  // Add MPI Logo
  const logoWidth = 20,
    logoHeight = 20;
  const logoX = (pageWidth - logoWidth) / 2;
  doc.addImage(mpi, "PNG", logoX, startY, logoWidth, logoHeight);
  startY += logoHeight + 10;

  // Company Info
  const companyName = "MIRPUR POLYTECHNIC INSTITUTE";
  const companyAddress = "Mukto Bangla Shopping Complex, Mirpur-1, Dhaka-1216";
  const documentHeader = "Consolidated Statement of Credit-Debit (Academic)";

  doc.setFont("helvetica", "bold").setFontSize(20);
  doc.text(
    companyName,
    (pageWidth - doc.getTextWidth(companyName)) / 2,
    startY
  );
  startY += 6;

  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(
    companyAddress,
    (pageWidth - doc.getTextWidth(companyAddress)) / 2,
    startY
  );
  startY += 10;

  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(
    documentHeader,
    (pageWidth - doc.getTextWidth(documentHeader)) / 2,
    startY
  );
  startY += 10;

  startY += 10; // Space before table

  // Table Headers
  const headers = [
    "Date",
    "Type",
    "Category",
    "Payment Method",
    "Remarks",
    "Amount",
  ];
  const totalWidth = headerSpacing * headers.length;
  const startX = (pageWidth - totalWidth) / 2;

  doc.setFont("helvetica", "bold").setFontSize(12);
  headers.forEach((header, index) => {
    const xPos = startX + index * headerSpacing;
    doc.rect(xPos, startY, headerSpacing, cellHeight);
    doc.text(
      header,
      xPos + (headerSpacing - doc.getTextWidth(header)) / 2,
      startY + 6
    );
  });

  doc.setFont("helvetica", "normal").setFontSize(12);
  startY += cellHeight;

  if (transactions.length === 0) {
    doc.text(
      "No Data Available",
      (pageWidth - doc.getTextWidth("No Data Available")) / 2,
      startY + 6
    );
  } else {
    transactions.forEach((transaction, rowIndex) => {
      const rowData = [
        new Date(transaction.date).toLocaleDateString("en-GB"),
        transaction.type,
        transaction.category.name,
        transaction.paymentMethod.name,
        transaction.remarks || "N/A",
        transaction.amount.toLocaleString("en-GB"),
      ];

      let rowHeight = cellHeight;
      const wrappedRowData = rowData.map((data, index) => {
        const wrappedText = doc.splitTextToSize(data, headerSpacing - 4);
        rowHeight = Math.max(rowHeight, wrappedText.length * 6);
        return wrappedText;
      });

      wrappedRowData.forEach((wrappedText, index) => {
        const xPos = startX + index * headerSpacing;
        doc.rect(xPos, startY, headerSpacing, rowHeight);
        wrappedText.forEach((line, lineIndex) => {
          const yPos = startY + 6 + lineIndex * 4;
          if (headers[index] === "Amount") {
            const textWidth = doc.getTextWidth(line);
            doc.text(line, xPos + headerSpacing - textWidth - 2, yPos);
          } else {
            doc.text(line, xPos + 2, yPos);
          }
        });
      });

      startY += rowHeight;

      // **Check for new page**
      if (startY + cellHeight > pageHeight - 30) {
        doc.addPage();
        startY = 30;
        pageNumber++;

        // **Brand Name on Each Page**
        const brandName = "Nexx-Vantage";
        const brandFontSize = 8;
        const footerY = pageHeight - 10;
        doc.setFont("helvetica", "normal").setFontSize(brandFontSize);
        doc.setTextColor(100, 100, 100, 0.5 * 255);
        doc.text(
          brandName,
          (pageWidth - doc.getTextWidth(brandName)) / 2,
          footerY
        );
        doc.setTextColor(0, 0, 0);

        // Page Number
        doc.setFont("helvetica", "normal").setFontSize(10);
        doc.text(`Page ${pageNumber}`, pageWidth - 40, pageHeight - 15);

        // **Re-draw Headers**
        doc.setFont("helvetica", "bold").setFontSize(12);
        headers.forEach((header, index) => {
          const xPos = startX + index * headerSpacing;
          doc.rect(xPos, startY, headerSpacing, cellHeight);
          doc.text(
            header,
            xPos + (headerSpacing - doc.getTextWidth(header)) / 2,
            startY + 6
          );
        });

        doc.setFont("helvetica", "normal").setFontSize(10);
        startY += cellHeight;
      }
    });
  }

  // Add space before the summary table
  startY += 10;

  // Conditionally include "Opening Balance" in headers and data
  const summaryHeaders = includeOpeningBalance
    ? ["Total Credit", "Total Debit", "Total Balance", "Net Balance"]
    : ["Total Credit", "Total Debit", "Total Balance"];

  const summaryData = includeOpeningBalance
    ? [
        `${totalCredit.toLocaleString("en-GB")}`,
        `${totalDebit.toLocaleString("en-GB")}`,
        `${totalBalance.toLocaleString("en-GB")}`,
        `${transactionsIncludingOpening.toLocaleString("en-GB")}`,
      ]
    : [
        `${totalCredit.toLocaleString("en-GB")}`,
        `${totalDebit.toLocaleString("en-GB")}`,
        `${totalBalance.toLocaleString("en-GB")}`,
      ];

  // Adjust the summary start position based on columns in the transaction table
  const summaryCellHeight = 10;
  let summaryStartX;

  if (includeOpeningBalance) {
    // Align summary with the last 4 columns
    summaryStartX = startX + headerSpacing * 2; // Adjust this value to shift the summary correctly
  } else {
    // Align summary with the last 3 columns
    summaryStartX = startX + headerSpacing * 3; // Adjust this value to shift the summary correctly
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  // Draw Summary Headers
  summaryHeaders.forEach((header, index) => {
    const xPos = summaryStartX + index * headerSpacing;
    doc.rect(xPos, startY, headerSpacing, summaryCellHeight);
    doc.text(
      header,
      xPos + (headerSpacing - doc.getTextWidth(header)) / 2,
      startY + 6
    );
  });

  // Draw Summary Data
  startY += summaryCellHeight;
  doc.setFont("helvetica", "normal");
  summaryData.forEach((data, index) => {
    const xPos = summaryStartX + index * headerSpacing;
    doc.rect(xPos, startY, headerSpacing, summaryCellHeight);
    doc.text(
      data,
      xPos + (headerSpacing - doc.getTextWidth(data)) / 2,
      startY + 6
    );
  });

  // **Final Page Number (Last Page)**
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`Page ${pageNumber}`, pageWidth - 40, pageHeight - 15); // Adjusted to prevent overlap

  // **Save the PDF**
  doc.save("transaction_report.pdf");
};
