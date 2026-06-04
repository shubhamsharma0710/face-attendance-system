const mongoose = require("mongoose");

const employeeSchema =
  new mongoose.Schema(
    {
      companyId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },

      employeeId: {
        type: String,
        required: [
          true,
          "Employee ID is required",
        ],
        unique: true,
        trim: true,
      },

      employeeName: {
        type: String,
        required: [
          true,
          "Employee Name is required",
        ],
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
      },

      mobile: {
        type: String,
        default: "",
        trim: true,
      },

      department: {
        type: String,
        default: "",
        trim: true,
      },

      designation: {
        type: String,
        default: "",
        trim: true,
      },

      descriptor: {
        type: [Number],
        required: [
          true,
          "Face descriptor vector is required",
        ],
      },

      isDeleted: {
        type: Boolean,
        default: false,
      },

      deletedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Employee",
    employeeSchema
  );