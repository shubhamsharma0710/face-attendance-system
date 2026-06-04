const mongoose = require("mongoose");

const companySchema =
  new mongoose.Schema(
    {
      companyName: {
        type: String,
        required: true,
      },

      adminName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      plan: {
        type: String,
        default: "Monthly",
      },

      startDate: {
        type: Date,
        default: Date.now,
      },

      expiryDate: {
        type: Date,
        required: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Company",
    companySchema
  );