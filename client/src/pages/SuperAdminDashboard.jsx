import React, {
useEffect,
useState,
} from "react";
import { API } from "../config"

import axios from "axios";

export default function SuperAdminDashboard({
setPage,
}) {
const [stats, setStats] =
useState({
totalCompanies: 0,
activeCompanies: 0,
expiredCompanies: 0,
totalEmployees: 0,
totalAttendance: 0,
});

useEffect(() => {
fetchDashboard();
}, []);

const fetchDashboard =
async () => {
try {
const response =
await axios.get(
  `${API}/api/config/superadmin/dashboard`
);


    setStats(
      response.data
    );
  } catch (error) {
    console.error(error);
  }
};


const cardStyle = {
width: "250px",
padding: "25px",
borderRadius: "10px",
backgroundColor:
"#1e293b",
color: "white",
textAlign: "center",
boxShadow:
"0 0 10px rgba(0,0,0,0.3)",
};

const logout = () => {
localStorage.removeItem(
"superAdminLoggedIn"
);


localStorage.removeItem(
  "superAdmin"
);

window.location.reload();


};

return (
<div
style={{
padding: "30px",
backgroundColor:
"#0f172a",
minHeight: "100vh",
color: "white",
}}
>
<h1
style={{
textAlign: "center",
}}
>
Super Admin Dashboard </h1>


  <div
    style={{
      display: "flex",
      justifyContent:
        "center",
      flexWrap: "wrap",
      gap: "20px",
      marginTop: "40px",
    }}
  >
    <div style={cardStyle}>
      <h2>
        Total Companies
      </h2>
      <h1>
        {
          stats.totalCompanies
        }
      </h1>
    </div>

    <div style={cardStyle}>
      <h2>
        Active Companies
      </h2>
      <h1>
        {
          stats.activeCompanies
        }
      </h1>
    </div>

    <div style={cardStyle}>
      <h2>
        Expired Companies
      </h2>
      <h1>
        {
          stats.expiredCompanies
        }
      </h1>
    </div>

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
        Total Attendance
      </h2>
      <h1>
        {
          stats.totalAttendance
        }
      </h1>
    </div>
  </div>

  <div
    style={{
      textAlign: "center",
      marginTop: "50px",
    }}
  >
    <button
      onClick={() =>
        setPage(
          "createCompany"
        )
      }
      style={{
        padding:
          "12px 20px",
        margin: "10px",
        cursor:
          "pointer",
      }}
    >
      Create Company
    </button>

    <button
      onClick={() =>
        setPage(
          "companies"
        )
      }
      style={{
        padding:
          "12px 20px",
        margin: "10px",
        cursor:
          "pointer",
      }}
    >
      Manage Companies
    </button>

    <button
      onClick={logout}
      style={{
        padding:
          "12px 20px",
        margin: "10px",
        cursor:
          "pointer",
        backgroundColor:
          "red",
        color: "white",
        border: "none",
      }}
    >
      Logout
    </button>
  </div>
</div>


);
}
