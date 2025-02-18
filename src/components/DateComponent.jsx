import React, { useState, useEffect } from "react";

const DateComponent = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000); // Update every second to keep the date in sync

    // Cleanup the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);

  // Format the date to dd/mm/yy
  const formattedDate = date.toLocaleDateString("en-GB"); // "en-GB" gives dd/mm/yyyy

  return (
    <div className="text-xl font-semibold text-gray-100">
      {formattedDate}
    </div>
  );
};

export default DateComponent;
