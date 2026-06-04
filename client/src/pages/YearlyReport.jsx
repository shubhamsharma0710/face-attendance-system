import React, {
useEffect,
useState,
} from "react";

export default function YearlyReport() {
const [attendance, setAttendance] =
useState([]);

useEffect(() => {
const data =
JSON.parse(
localStorage.getItem(
"attendance"
)
) || [];

```
setAttendance(data);
```

}, []);

const currentYear =
new Date()
.getFullYear()
.toString();

const yearlyData =
attendance.filter(
(item) =>
item.year === currentYear
);

return (
  <div>
    <h1>Yearly Attendance Report</h1>
    <h3>Year: {currentYear}</h3>
    {yearlyData.map((record, index) => (
      <p key={index}>
        {record.employeeName}
        {" - "}
        {record.date}
      </p>
    ))}
  </div>
);
}
