import React, {
  useEffect,
  useState,
} from "react";
import API from "../config";
import axios from "axios";
export default function Employees() {
  const [employees, setEmployees] =
    useState([]);

  const [deletedEmployees, setDeletedEmployees] =
    useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchDeletedEmployees();
  }, []);

  const fetchEmployees = async () => {
  try {
    const company = JSON.parse(
      localStorage.getItem("company")
    );

    const response =
      

await axios.get(
  `${API}/api/employees/all/${company._id}`
      );

    setEmployees(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const fetchDeletedEmployees =
    async () => {
      try {
        const company = JSON.parse(
          localStorage.getItem("company")
        );

        const response = await axios.get(
          `${API}/api/employees/deleted/list/${company._id}`
        );

        setDeletedEmployees(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  const deleteEmployee =
    async (id) => {
      if (
        !window.confirm(
          "Archive Employee?"
        )
      )
        return;

      try {
        await axios.delete(
          `${API}/api/employees/delete/${id}`
        );

        alert(
          "Employee Archived"
        );

        fetchEmployees();
        fetchDeletedEmployees();
      } catch (error) {
        console.error(error);
      }
    };

  const restoreEmployee =
    async (id) => {
      try {
        await axios.put(
          `${API}/api/employees/restore/${id}`
        );

        alert(
          "Employee Restored"
        );

        fetchEmployees();
        fetchDeletedEmployees();
      } catch (error) {
        console.error(error);
      }
    };

  const permanentDelete =
    async (id) => {
      if (
        !window.confirm(
          "Permanently Delete Employee?"
        )
      )
        return;

      try {
        await axios.delete(
          `${API}/api/employees/permanent/${id}`
        );

        alert(
          "Employee Deleted Permanently"
        );

        fetchDeletedEmployees();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>
        Active Employees
      </h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse:
            "collapse",
          marginBottom:
            "40px",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(
            (employee) => (
              <tr
                key={
                  employee._id
                }
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
                  <button
                    onClick={() =>
                      deleteEmployee(
                        employee._id
                      )
                    }
                  >
                    Archive
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <h1>
        Archived Employees
      </h1>

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
            <th>ID</th>
            <th>Name</th>
            <th>Deleted On</th>
            <th>Restore</th>
            <th>Permanent Delete</th>
          </tr>
        </thead>

        <tbody>
          {deletedEmployees.map(
            (employee) => (
              <tr
                key={
                  employee._id
                }
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
                  {employee.deletedAt
                    ? new Date(
                        employee.deletedAt
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      restoreEmployee(
                        employee._id
                      )
                    }
                  >
                    Restore
                  </button>
                </td>

                <td>
                  <button
                    onClick={() =>
                      permanentDelete(
                        employee._id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}