import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import API from "../config";

export default function Analytics() {
  const [attendance, setAttendance] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const company = JSON.parse(
        localStorage.getItem("company")
      );

      if (!company?._id) {
        alert(
          "Company not found. Please login again."
        );
        return;
      }

      const attendanceRes =
        await axios.get(
          `${API}/api/attendance/company/${company._id}`
        );

      const employeeRes =
        await axios.get(
          `${API}/api/employees/all/${company._id}`
        );

      setAttendance(
        attendanceRes.data || []
      );

      setEmployees(
        employeeRes.data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const today =
    new Date().toLocaleDateString();

  const yesterdayDate =
    new Date();

  yesterdayDate.setDate(
    yesterdayDate.getDate() - 1
  );

  const yesterday =
    yesterdayDate.toLocaleDateString();

  const todayData =
    attendance.filter(
      (item) =>
        new Date(
          item.timestamp
        ).toLocaleDateString() ===
        today
    );

  const yesterdayData =
    attendance.filter(
      (item) =>
        new Date(
          item.timestamp
        ).toLocaleDateString() ===
        yesterday
    );

  const monthlyReport =
    employees.map(
      (employee) => {
        const count =
          attendance.filter(
            (record) => {
              const date =
                new Date(
                  record.timestamp
                );

              return (
                String(
                  record.employeeId
                    ?._id
                ) ===
                  String(
                    employee._id
                  ) &&
                date.getMonth() ===
                  new Date().getMonth() &&
                date.getFullYear() ===
                  new Date().getFullYear()
              );
            }
          ).length;

        return {
          employeeId:
            employee.employeeId,
          employeeName:
            employee.employeeName,
          totalAttendance:
            count,
        };
      }
    );

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign:
            "center",
        }}
      >
        Attendance Analytics
      </h1>

      <hr />

      <h2>
        Today's Attendance
      </h2>

      <p>
        Present:{" "}
        {
          todayData.filter(
            (a) =>
              a.status ===
              "Present"
          ).length
        }
      </p>

      <p>
        Late:{" "}
        {
          todayData.filter(
            (a) =>
              a.status ===
              "Late"
          ).length
        }
      </p>

      <p>
        Absent:{" "}
        {
          todayData.filter(
            (a) =>
              a.status ===
              "Absent"
          ).length
        }
      </p>

      <hr />

      <h2>
        Yesterday's Attendance
      </h2>

      <p>
        Present:{" "}
        {
          yesterdayData.filter(
            (a) =>
              a.status ===
              "Present"
          ).length
        }
      </p>

      <p>
        Late:{" "}
        {
          yesterdayData.filter(
            (a) =>
              a.status ===
              "Late"
          ).length
        }
      </p>

      <p>
        Absent:{" "}
        {
          yesterdayData.filter(
            (a) =>
              a.status ===
              "Absent"
          ).length
        }
      </p>

      <hr />

      <h2>
        Monthly Employee Report
      </h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse:
            "collapse",
        }}
      >
        <thead>
          <tr>
            <th>
              Employee ID
            </th>
            <th>
              Employee Name
            </th>
            <th>
              Present Days
            </th>
          </tr>
        </thead>

        <tbody>
          {monthlyReport.length >
          0 ? (
            monthlyReport.map(
              (
                employee,
                index
              ) => (
                <tr
                  key={index}
                >
                  <td>
                    {
                      employee.employeeId
                    }
                  </td>

                  <td>
                    {
                      employee.employeeName
                    }
                  </td>

                  <td>
                    {
                      employee.totalAttendance
                    }
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan="3"
                style={{
                  textAlign:
                    "center",
                }}
              >
                No Employee Data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <hr />

      <h2>
        Date Wise Attendance
      </h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse:
            "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>
              Employee
            </th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {attendance.length >
          0 ? (
            attendance.map(
              (
                record,
                index
              ) => (
                <tr
                  key={index}
                >
                  <td>
                    {new Date(
                      record.timestamp
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {record
                      .employeeId
                      ?.employeeName ||
                      "N/A"}
                  </td>

                  <td>
                    {
                      record.status
                    }
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan="3"
                style={{
                  textAlign:
                    "center",
                }}
              >
                No Attendance Data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}