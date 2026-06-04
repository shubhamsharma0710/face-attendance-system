const express = require("express");
const router = express.Router();

const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

// =================================
// REGISTER EMPLOYEE
// =================================
router.post("/register", async (req, res) => {
try {
const {
companyId,
employeeId,
employeeName,
email,
mobile,
department,
designation,
descriptor,
} = req.body;


if (
  !companyId ||
  !employeeId ||
  !employeeName ||
  !descriptor
) {
  return res.status(400).json({
    message:
      "Company ID, Employee ID, Employee Name and Face Descriptor are required",
  });
}

const existingEmployee =
  await Employee.findOne({
    employeeId,
    companyId,
  });

if (existingEmployee) {
  return res.status(400).json({
    message:
      "Employee ID already exists",
  });
}

const employee =
  await Employee.create({
    companyId,
    employeeId,
    employeeName,
    email,
    mobile,
    department,
    designation,
    descriptor,
  });

res.status(201).json({
  success: true,
  message:
    "Employee Registered Successfully",
  employee,
});


} catch (error) {
console.error(error);


res.status(500).json({
  success: false,
  message:
    error.message,
});


}
});

// =================================
// GET ALL ACTIVE EMPLOYEES
// =================================
router.get("/all/:companyId", async (req, res) => {
try {
const employees =
await Employee.find({
companyId:
req.params.companyId,
isDeleted: false,
}).sort({
employeeName: 1,
});


res.json(employees);


} catch (error) {
console.error(error);


res.status(500).json({
  success: false,
  message:
    error.message,
});


}
});

// =================================
// GET SINGLE EMPLOYEE
// =================================
router.get("/:id", async (req, res) => {
try {
const employee =
await Employee.findById(
req.params.id
);


if (!employee) {
  return res.status(404).json({
    message:
      "Employee Not Found",
  });
}

res.json(employee);


} catch (error) {
console.error(error);


res.status(500).json({
  success: false,
  message:
    error.message,
});


}
});

// =================================
// ARCHIVE EMPLOYEE
// =================================
router.delete("/delete/:id", async (req, res) => {
try {
const employee =
await Employee.findById(
req.params.id
);


if (!employee) {
  return res.status(404).json({
    message:
      "Employee Not Found",
  });
}

employee.isDeleted = true;
employee.deletedAt =
  new Date();

await employee.save();

res.json({
  success: true,
  message:
    "Employee Archived Successfully",
});


} catch (error) {
console.error(error);


res.status(500).json({
  success: false,
  message:
    error.message,
});


}
});

// =================================
// RESTORE EMPLOYEE
// =================================
router.put("/restore/:id", async (req, res) => {
try {
const employee =
await Employee.findById(
req.params.id
);


if (!employee) {
  return res.status(404).json({
    message:
      "Employee Not Found",
  });
}

employee.isDeleted = false;
employee.deletedAt = null;

await employee.save();

res.json({
  success: true,
  message:
    "Employee Restored Successfully",
});


} catch (error) {
console.error(error);


res.status(500).json({
  success: false,
  message:
    error.message,
});


}
});

// =================================
// GET DELETED EMPLOYEES
// =================================
router.get(
"/deleted/list/:companyId",
async (req, res) => {
try {
const employees =
await Employee.find({
companyId:
req.params.companyId,
isDeleted: true,
}).sort({
deletedAt: -1,
});


  res.json(employees);
} catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    message:
      error.message,
  });
}


}
);

// =================================
// PERMANENT DELETE EMPLOYEE
// =================================
router.delete(
"/permanent/:id",
async (req, res) => {
try {
const employeeId =
req.params.id;


  const employee =
    await Employee.findByIdAndDelete(
      employeeId
    );

  if (!employee) {
    return res.status(404).json({
      message:
        "Employee Not Found",
    });
  }

  await Attendance.deleteMany({
    employeeId:
      employeeId,
  });

  res.json({
    success: true,
    message:
      "Employee Permanently Deleted",
  });
} catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    message:
      error.message,
  });
}


}
);

// =================================
// DELETE ALL EMPLOYEES OF COMPANY
// =================================
router.delete(
"/delete-all/:companyId",
async (req, res) => {
try {
const companyId =
req.params.companyId;


  const employees =
    await Employee.find({
      companyId,
    });

  const employeeIds =
    employees.map(
      (emp) => emp._id
    );

  await Employee.deleteMany({
    companyId,
  });

  await Attendance.deleteMany({
    employeeId: {
      $in: employeeIds,
    },
  });

  res.json({
    success: true,
    message:
      "All Employees Deleted Successfully",
  });
} catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    message:
      error.message,
  });
}


}
);

module.exports = router;
