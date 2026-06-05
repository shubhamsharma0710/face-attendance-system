import React, {
useEffect,
useState,
} from "react";

import axios from "axios";
import API from "../config";

export default function Dashboard() {
const company = JSON.parse(
localStorage.getItem("company")
);

const [stats, setStats] =
useState({
totalEmployees: 0,
presentToday: 0,
absentToday: 0,
lateToday: 0,
archivedEmployees: 0,
totalAttendance: 0,
});

useEffect(() => {
if (company?._id) {
fetchDashboardData();


  const interval =
    setInterval(
      fetchDashboardData,
      10000
    );

  return () =>
    clearInterval(interval);
}


}, []);

const fetchDashboardData =
async () => {
try {
const employeeRes =

await axios.get(
  `${API}/api/employees/all`
);

    const attendanceRes =
      await axios.get(
  `${API}/api/attendance/company/${company._id}`
      );

    const employees =
      employeeRes.data || [];

    const attendance =
      attendanceRes.data || [];

    const today =
      new Date().toLocaleDateString();

    const todayAttendance =
      attendance.filter(
        (record) =>
          new Date(
            record.timestamp
          ).toLocaleDateString() ===
          today
      );

    const activeEmployees =
      employees.filter(
        (emp) =>
          !emp.isDeleted
      ).length;

    const archivedEmployees =
      employees.filter(
        (emp) =>
          emp.isDeleted
      ).length;

    const presentToday =
      todayAttendance.filter(
        (record) =>
          record.status ===
          "Present"
      ).length;

    const lateToday =
      todayAttendance.filter(
        (record) =>
          record.status ===
          "Late"
      ).length;

    const absentToday =
      activeEmployees -
      presentToday -
      lateToday;

    setStats({
      totalEmployees:
        activeEmployees,

      presentToday,

      absentToday:
        absentToday < 0
          ? 0
          : absentToday,

      lateToday,

      archivedEmployees,

      totalAttendance:
        attendance.length,
    });
  } catch (error) {
    console.error(error);
  }
};


const cardStyle = {
width: "250px",
padding: "25px",
borderRadius: "12px",
backgroundColor:
"#1e293b",
color: "white",
textAlign: "center",
boxShadow:
"0px 0px 10px rgba(0,0,0,0.3)",
};

return (
<div
style={{
padding: "30px",
minHeight: "100vh",
backgroundColor:
"#0f172a",
color: "white",
}}
>
<h1
style={{
textAlign:
"center",
}}
>
Company Dashboard </h1>


  <h3
    style={{
      textAlign:
        "center",
      marginBottom:
        "40px",
    }}
  >
    Welcome{" "}
    {company?.companyName}
  </h3>

  <div
    style={{
      display: "flex",
      flexWrap:
        "wrap",
      justifyContent:
        "center",
      gap: "20px",
    }}
  >
    <div style={cardStyle}>
      <h2>
        Total Employees
      </h2>
      <h1>
        {
          stats.totalEmployees
        }
      </h1>
    </div>

    <div style={cardStyle}>
      <h2>
        Present Today
      </h2>
      <h1>
        {
          stats.presentToday
        }
      </h1>
    </div>

    <div style={cardStyle}>
      <h2>
        Late Today
      </h2>
      <h1>
        {stats.lateToday}
      </h1>
    </div>

    <div style={cardStyle}>
      <h2>
        Absent Today
      </h2>
      <h1>
        {
          stats.absentToday
        }
      </h1>
    </div>

    <div style={cardStyle}>
      <h2>
        Archived Employees
      </h2>
      <h1>
        {
          stats.archivedEmployees
        }
      </h1>
    </div>

    <div style={cardStyle}>
      <h2>
        Total Attendance
      </h2>
      <h1>
        {
          stats.totalAttendance
        }
      </h1>
    </div>
  </div>
</div>


);
}
