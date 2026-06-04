const mongoose = require("mongoose");

const attendanceSchema =
  new mongoose.Schema(
    {
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },

      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: [
          true,
          "Employee ID reference is required",
        ],
      },

      timestamp: {
        type: Date,
        default: Date.now,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Present",
          "Absent",
          "Late",
          "Half-Day",
        ],
        default: "Present",
        required: true,
      },

      checkInTime: {
        type: String,
        default: "",
      },

      checkOutTime: {
        type: String,
        default: "",
      },

      remarks: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Attendance",
    attendanceSchema
  );