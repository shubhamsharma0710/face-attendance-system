import React, { useEffect, useState } from "react";

export default function MonthlyReport() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("attendance")) || [];
    setAttendance(data);
  }, []);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const monthlyData = attendance.filter((item) => item.month === currentMonth);

  return (
    <div>
      <h1>Monthly Attendance Report</h1>
      <h3>Month: {currentMonth}</h3>
      {monthlyData.map((record, index) => (
        <p key={index}>
          {record.employeeName} {" - "} {record.date}
        </p>
      ))}
    </div>
  );
}
