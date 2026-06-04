const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } =
      req.body;

    if (!username || !password) {
      return res.status(400).json({
        message:
          "Username and Password are required",
      });
    }

    const admin =
      await Admin.findOne({
        username,
      });

    if (!admin) {
      return res.status(400).json({
        message:
          "Invalid Username",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      message:
        "Login Successful",

      token,

      admin: {
        id: admin._id,
        username:
          admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Admin Profile
router.get(
  "/profile",
  async (req, res) => {
    try {
      res.json({
        message:
          "Admin Profile Route Working",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;