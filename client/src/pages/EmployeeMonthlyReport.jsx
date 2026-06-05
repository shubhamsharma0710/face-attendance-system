import React, {
useEffect,
useState,
} from "react";
import API from "../config";
import axios from "axios";
import jsPDF from "jspdf";

export default function EmployeeMonthlyReport() {
const company = JSON.parse(
localStorage.getItem(
"company"
)
);

const [employees, setEmployees] =
useState([]);

const [search, setSearch] =
useState("");

const [report, setReport] =
useState(null);

const [month, setMonth] =
useState(
new Date().getMonth() + 1
);

const [year, setYear] =
useState(
new Date().getFullYear()
);

useEffect(() => {
fetchEmployees();
}, []);

const fetchEmployees =
async () => {
try {
const response =


await axios.get(
  `${API}/api/employees/all/${company._id}`
);


    setEmployees(
      response.data
    );
  } catch (error) {
    console.error(error);
  }
};


const filteredEmployees =
employees.filter(
(emp) =>
emp.employeeName
?.toLowerCase()
.includes(
search.toLowerCase()
) ||
emp.employeeId
?.toLowerCase()
.includes(
search.toLowerCase()
)
);

const fetchReport =
async (
employeeMongoId
) => {
try {
const response =
await axios.get(
  `${API}/api/attendance/employee-summary/${employeeMongoId}/${month}/${year}`
);


    setReport(
      response.data
    );
  } catch (error) {
    console.error(error);

    alert(
      "Failed to Load Report"
    );
  }
};


const downloadPDF = () => {
if (!report) return;


const doc =
  new jsPDF();

doc.setFontSize(18);

doc.text(
  "Monthly Attendance Report",
  20,
  20
);

doc.setFontSize(12);

doc.text(
  `Company : ${company.companyName}`,
  20,
  40
);

doc.text(
  `Employee ID : ${report.employeeId}`,
  20,
  55
);

doc.text(
  `Employee Name : ${report.employeeName}`,
  20,
  70
);

doc.text(
  `Month : ${month}`,
  20,
  85
);

doc.text(
  `Year : ${year}`,
  20,
  100
);

doc.text(
  `Present Days : ${report.present}`,
  20,
  120
);

doc.text(
  `Late Days : ${report.late}`,
  20,
  135
);

doc.text(
  `Absent Days : ${report.absent}`,
  20,
  150
);

doc.save(
  `${report.employeeName}-${month}-${year}.pdf`
);


};

const years = [];

for (
let y = 2025;
y <=
new Date().getFullYear() +
5;
y++
) {
years.push(y);
}

return (
<div
style={{
padding: "20px",
}}
> <h1>
Employee Monthly Report </h1>


  <div
    style={{
      display: "flex",
      gap: "10px",
      marginBottom:
        "20px",
    }}
  >
    <input
      type="text"
      placeholder="Search Employee ID or Name"
      value={search}
      onChange={(e) =>
        setSearch(
          e.target.value
        )
      }
      style={{
        width: "350px",
        padding: "10px",
      }}
    />

    <select
      value={month}
      onChange={(e) =>
        setMonth(
          e.target.value
        )
      }
    >
      <option value="1">
        January
      </option>
      <option value="2">
        February
      </option>
      <option value="3">
        March
      </option>
      <option value="4">
        April
      </option>
      <option value="5">
        May
      </option>
      <option value="6">
        June
      </option>
      <option value="7">
        July
      </option>
      <option value="8">
        August
      </option>
      <option value="9">
        September
      </option>
      <option value="10">
        October
      </option>
      <option value="11">
        November
      </option>
      <option value="12">
        December
      </option>
    </select>

    <select
      value={year}
      onChange={(e) =>
        setYear(
          e.target.value
        )
      }
    >
      {years.map((y) => (
        <option
          key={y}
          value={y}
        >
          {y}
        </option>
      ))}
    </select>
  </div>

  {search &&
    filteredEmployees.map(
      (emp) => (
        <div
          key={emp._id}
          onClick={() =>
            fetchReport(
              emp._id
            )
          }
          style={{
            border:
              "1px solid #ddd",
            padding:
              "10px",
            marginBottom:
              "5px",
            cursor:
              "pointer",
            borderRadius:
              "5px",
          }}
        >
          <strong>
            {
              emp.employeeId
            }
          </strong>
          {" - "}
          {
            emp.employeeName
          }
        </div>
      )
    )}

  {report && (
    <div
      style={{
        marginTop:
          "30px",
        padding:
          "20px",
        border:
          "1px solid #ddd",
        borderRadius:
          "10px",
      }}
    >
      <h2>
        {
          report.employeeName
        }
      </h2>

      <p>
        Employee ID :
        {" "}
        {
          report.employeeId
        }
      </p>

      <p>
        Present Days :
        {" "}
        {
          report.present
        }
      </p>

      <p>
        Late Days :
        {" "}
        {report.late}
      </p>

      <p>
        Absent Days :
        {" "}
        {
          report.absent
        }
      </p>

      <button
        onClick={
          downloadPDF
        }
        style={{
          padding:
            "10px 20px",
          cursor:
            "pointer",
        }}
      >
        Download PDF
      </button>
    </div>
  )}
</div>


);
}
