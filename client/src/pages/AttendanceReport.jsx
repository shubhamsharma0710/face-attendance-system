import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

export default function AttendanceReport() {
const [attendance, setAttendance] = useState([]);

useEffect(() => {
fetchAttendance();
}, []);

const fetchAttendance = async () => {
try {
const response = await axios.get(
  `${API}/api/employees/all`
);
setAttendance(response.data);
} catch (error) {
console.error(error);
}
};

const deleteAttendance = async (id) => {
const confirmDelete = window.confirm(
"Delete Attendance Record?"
);


if (!confirmDelete) return;

try {
  await axios.delete(
    `${API}/api/attendance/delete/${id}`
  );

  fetchAttendance();

  alert(
    "Attendance Deleted Successfully"
  );
} catch (error) {
  console.error(error);
}


};

const getStatusStyle = (status) => {
if (status === "Present") {
return {
color: "white",
backgroundColor: "green",
padding: "5px 10px",
borderRadius: "5px",
};
}

if (status === "Late") {
  return {
    color: "black",
    backgroundColor: "yellow",
    padding: "5px 10px",
    borderRadius: "5px",
  };
}

if (status === "Absent") {
  return {
    color: "white",
    backgroundColor: "red",
    padding: "5px 10px",
    borderRadius: "5px",
  };
}

return {};


};

return (
<div
style={{
padding: "20px",
minHeight: "100vh",
backgroundColor: "#0f172a",
color: "white",
}}
>
<h1
style={{
textAlign: "center",
marginBottom: "30px",
}}
>
Attendance Report </h1>


  <table
    border="1"
    cellPadding="10"
    style={{
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "center",
      backgroundColor: "#1e293b",
    }}
  >
    <thead>
      <tr>
        <th>Sr No.</th>
        <th>Employee ID</th>
        <th>Employee Name</th>
        <th>Status</th>
        <th>Date</th>
        <th>Time</th>
        <th>Check In</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {attendance.length === 0 ? (
        <tr>
          <td colSpan="8">
            No Attendance Records Found
          </td>
        </tr>
      ) : (
        attendance.map(
          (record, index) => (
            <tr key={record._id}>
              <td>{index + 1}</td>

              <td>
                {
                  record.employeeId
                    ?.employeeId
                }
              </td>

              <td>
                {
                  record.employeeId
                    ?.employeeName
                }
              </td>

              <td>
                <span
                  style={getStatusStyle(
                    record.status
                  )}
                >
                  {record.status}
                </span>
              </td>

              <td>
                {new Date(
                  record.timestamp
                ).toLocaleDateString()}
              </td>

              <td>
                {new Date(
                  record.timestamp
                ).toLocaleTimeString()}
              </td>

              <td>
                {record.checkInTime ||
                  "-"}
              </td>

              <td>
                <button
                  onClick={() =>
                    deleteAttendance(
                      record._id
                    )
                  }
                  style={{
                    backgroundColor:
                      "red",
                    color: "white",
                    border: "none",
                    padding:
                      "8px 12px",
                    cursor:
                      "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        )
      )}
    </tbody>
  </table>
</div>

);
}
