import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Attendance from "./pages/Attendance";
import AttendanceReport from "./pages/AttendanceReport";
import Employees from "./pages/Employees";
import Analytics from "./pages/Analytics";
import EmployeeMonthlyReport from "./pages/EmployeeMonthlyReport";

import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CreateCompany from "./pages/CreateCompany";
import Companies from "./pages/Companies";

function App() {
  const [mode, setMode] = useState("company");

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [
    superAdminLoggedIn,
    setSuperAdminLoggedIn,
  ] = useState(
    localStorage.getItem(
      "superAdminLoggedIn"
    ) === "true"
  );

  const [page, setPage] =
    useState("dashboard");

  // =================================
  // SUPER ADMIN SECTION
  // =================================

  if (mode === "superadmin") {
    if (!superAdminLoggedIn) {
      return (
        <div>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() =>
                setMode("company")
              }
            >
              Company Login
            </button>
          </div>

          <SuperAdminLogin
            onLogin={() =>
              setSuperAdminLoggedIn(true)
            }
          />
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor:
              "#0f172a",
            color: "white",
          }}
        >
          <h1>
            Super Admin Panel
          </h1>

          <button
            onClick={() =>
              setPage(
                "superdashboard"
              )
            }
            style={{
              padding:
                "10px 20px",
              margin: "5px",
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              setPage(
                "createcompany"
              )
            }
            style={{
              padding:
                "10px 20px",
              margin: "5px",
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
                "10px 20px",
              margin: "5px",
            }}
          >
            Manage Companies
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(
                "superAdminLoggedIn"
              );

              localStorage.removeItem(
                "superAdmin"
              );

              window.location.reload();
            }}
            style={{
              padding:
                "10px 20px",
              margin: "5px",
              backgroundColor:
                "red",
              color: "white",
              border: "none",
            }}
          >
            Logout
          </button>
        </div>

        {page ===
          "superdashboard" && (
          <SuperAdminDashboard />
        )}

        {page ===
          "createcompany" && (
          <CreateCompany />
        )}

        {page ===
          "companies" && (
          <Companies />
        )}
      </div>
    );
  }

  // =================================
  // COMPANY LOGIN
  // =================================

  if (!loggedIn) {
    return (
      <div>
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() =>
              setMode(
                "superadmin"
              )
            }
          >
            Super Admin Login
          </button>
        </div>

        <Login
          onLogin={() =>
            setLoggedIn(true)
          }
        />
      </div>
    );
  }

  // =================================
  // COMPANY LOGOUT
  // =================================

  const handleLogout = () => {
    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "company"
    );

    window.location.reload();
  };

  const btnStyle = {
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
  };

  // =================================
  // COMPANY PANEL
  // =================================

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor:
            "#f8fafc",
          borderBottom:
            "1px solid #ddd",
        }}
      >
        <h1>
          Face Attendance
          System
        </h1>

        <button
          onClick={() =>
            setPage(
              "dashboard"
            )
          }
          style={btnStyle}
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            setPage(
              "register"
            )
          }
          style={btnStyle}
        >
          Registration
        </button>

        <button
          onClick={() =>
            setPage(
              "attendance"
            )
          }
          style={btnStyle}
        >
          Attendance
        </button>

        <button
          onClick={() =>
            setPage("report")
          }
          style={btnStyle}
        >
          Report
        </button>

        <button
          onClick={() =>
            setPage(
              "monthlyreport"
            )
          }
          style={btnStyle}
        >
          Monthly Report
        </button>

        <button
          onClick={() =>
            setPage(
              "analytics"
            )
          }
          style={btnStyle}
        >
          Analytics
        </button>

        <button
          onClick={() =>
            setPage(
              "employees"
            )
          }
          style={btnStyle}
        >
          Employees
        </button>

        <button
          onClick={
            handleLogout
          }
          style={{
            ...btnStyle,
            backgroundColor:
              "red",
            color: "white",
            border: "none",
          }}
        >
          Logout
        </button>
      </div>

      {page === "dashboard" && (
        <Dashboard />
      )}

      {page === "register" && (
        <Register />
      )}

      {page === "attendance" && (
        <Attendance />
      )}

      {page === "report" && (
        <AttendanceReport />
      )}

      {page ===
        "monthlyreport" && (
        <EmployeeMonthlyReport />
      )}

      {page === "analytics" && (
        <Analytics />
      )}

      {page === "employees" && (
        <Employees />
      )}
    </div>
  );
}

export default App;