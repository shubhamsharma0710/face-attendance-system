const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// =================================
// MARK ATTENDANCE
// =================================
router.post("/mark", async (req, res) => {
  try {
    console.log(
      "Attendance Request:",
      req.body
    );

    const {
  companyId,
  employeeId,
  status,
  checkInTime,
  checkOutTime,
} = req.body;

    if (!employeeId) {
      return res.status(400).json({
        message:
          "Employee ID is required",
      });
    }

    const employee =
      await Employee.findById(
        employeeId
      );

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee Not Found",
      });
    }

    const today = new Date();
    today.setHours(
      0,
      0,
      0,
      0
    );

    const tomorrow =
      new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const alreadyMarked =
      await Attendance.findOne({
        employeeId,
        timestamp: {
          $gte: today,
          $lt: tomorrow,
        },
      });

    if (alreadyMarked) {
      return res.status(400).json({
        message:
          "Attendance already marked today",
      });
    }

    const attendance =
  await Attendance.create({
    companyId,
    employeeId,
    timestamp:
      new Date(),
    status:
      status || "Present",
    checkInTime:
      checkInTime ||
      new Date().toLocaleTimeString(),
    checkOutTime:
      checkOutTime || "",
  });

    console.log(
      "Attendance Saved:",
      attendance
    );

    res.status(201).json({
      success: true,
      message:
        "Attendance Marked Successfully",
      attendance,
    });
  } catch (error) {
    console.error(
      "Attendance Save Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
});

// =================================
// AUTO ABSENT
// =================================
router.post(
  "/auto-absent",
  async (req, res) => {
    try {
      const employees =
        await Employee.find({
          isDeleted: false,
        });

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const tomorrow =
        new Date(today);

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      let absentCount = 0;

      for (const employee of employees) {
        const alreadyMarked =
          await Attendance.findOne({
            employeeId:
              employee._id,
            timestamp: {
              $gte: today,
              $lt: tomorrow,
            },
          });

        if (!alreadyMarked) {
          await Attendance.create({
            employeeId:
              employee._id,
            status:
              "Absent",
            timestamp:
              new Date(),
          });

          absentCount++;
        }
      }

      res.json({
        message:
          "Absent Employees Marked Successfully",
        absentCount,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// GET ALL ATTENDANCE
// =================================
router.get("/all", async (req, res) => {
  try {
    const attendance =
      await Attendance.find()
        .populate(
          "employeeId",
          "employeeId employeeName"
        )
        .sort({
          timestamp: -1,
        });

    res.json(attendance);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
});

// =================================
// MONTHLY REPORT
// =================================
router.get(
  "/monthly/:month/:year",
  async (req, res) => {
    try {
      const month =
        parseInt(
          req.params.month
        );

      const year =
        parseInt(
          req.params.year
        );

      const startDate =
        new Date(
          year,
          month - 1,
          1
        );

      const endDate =
        new Date(
          year,
          month,
          1
        );

      const attendance =
        await Attendance.find({
          timestamp: {
            $gte:
              startDate,
            $lt:
              endDate,
          },
        })
          .populate(
            "employeeId",
            "employeeId employeeName"
          )
          .sort({
            timestamp: -1,
          });

      res.json(attendance);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// YEARLY REPORT
// =================================
router.get(
  "/yearly/:year",
  async (req, res) => {
    try {
      const year =
        parseInt(
          req.params.year
        );

      const startDate =
        new Date(
          year,
          0,
          1
        );

      const endDate =
        new Date(
          year + 1,
          0,
          1
        );

      const attendance =
        await Attendance.find({
          timestamp: {
            $gte:
              startDate,
            $lt:
              endDate,
          },
        })
          .populate(
            "employeeId",
            "employeeId employeeName"
          )
          .sort({
            timestamp: -1,
          });

      res.json(attendance);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// DELETE SINGLE ATTENDANCE
// =================================
router.delete(
  "/delete/:id",
  async (req, res) => {
    try {
      const attendance =
        await Attendance.findByIdAndDelete(
          req.params.id
        );

      if (!attendance) {
        return res.status(404).json({
          message:
            "Attendance Record Not Found",
        });
      }

      res.json({
        message:
          "Attendance Deleted Successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// DELETE ALL ATTENDANCE
// =================================
router.delete(
  "/delete-all",
  async (req, res) => {
    try {
      await Attendance.deleteMany(
        {}
      );

      res.json({
        message:
          "All Attendance Records Deleted Successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

router.get(
"/monthly-summary/:month/:year",
async (req, res) => {
try {
const month = parseInt(req.params.month);
const year = parseInt(req.params.year);


  const startDate = new Date(
    year,
    month - 1,
    1
  );

  const endDate = new Date(
    year,
    month,
    1
  );

  const employees =
    await Employee.find({
      isDeleted: false,
    });

  const report = [];

  for (const employee of employees) {
    const attendance =
      await Attendance.find({
        employeeId: employee._id,
        timestamp: {
          $gte: startDate,
          $lt: endDate,
        },
      });

    const present =
      attendance.filter(
        (a) =>
          a.status === "Present"
      ).length;

    const late =
      attendance.filter(
        (a) =>
          a.status === "Late"
      ).length;

    const absent =
      attendance.filter(
        (a) =>
          a.status === "Absent"
      ).length;

    report.push({
      employeeId:
        employee.employeeId,
      employeeName:
        employee.employeeName,
      present,
      late,
      absent,
    });
  }

  res.json(report);
} catch (error) {
  res.status(500).json({
    message: error.message,
  });
}


}
);
// =================================
// SINGLE EMPLOYEE MONTHLY REPORT
// =================================
router.get(
  "/employee-summary/:employeeId/:month/:year",
  async (req, res) => {
    try {
      const {
        employeeId,
        month,
        year,
      } = req.params;

      const startDate = new Date(
        year,
        month - 1,
        1
      );

      const endDate = new Date(
        year,
        month,
        1
      );

      const employee =
        await Employee.findById(
          employeeId
        );

      if (!employee) {
        return res.status(404).json({
          message:
            "Employee Not Found",
        });
      }

      const attendance =
        await Attendance.find({
          employeeId,
          timestamp: {
            $gte: startDate,
            $lt: endDate,
          },
        });

      const present =
        attendance.filter(
          (item) =>
            item.status === "Present"
        ).length;

      const late =
        attendance.filter(
          (item) =>
            item.status === "Late"
        ).length;

      const absent =
        attendance.filter(
          (item) =>
            item.status === "Absent"
        ).length;

      res.json({
        employeeId:
          employee.employeeId,
        employeeName:
          employee.employeeName,
        present,
        late,
        absent,
        totalAttendance:
          attendance.length,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);
// =================================
// GET ATTENDANCE BY COMPANY
// =================================
router.get(
  "/company/:companyId",
  async (req, res) => {
    try {
      const attendance =
        await Attendance.find({
          companyId:
            req.params.companyId,
        })
          .populate(
            "employeeId",
            "employeeId employeeName"
          )
          .sort({
            timestamp: -1,
          });

      res.json(attendance);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports = router;