const express = require("express");
const router = express.Router();

const Company = require("../models/Company");

// =================================
// CREATE COMPANY
// =================================
router.post("/create", async (req, res) => {
  try {
    const {
      companyName,
      adminName,
      email,
      password,
      plan,
      expiryDate,
    } = req.body;

    if (
      !companyName ||
      !adminName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "All required fields are required",
      });
    }

    const existingCompany =
      await Company.findOne({
        email,
      });

    if (existingCompany) {
      return res.status(400).json({
        message:
          "Company Already Exists",
      });
    }

    const company =
      await Company.create({
        companyName,
        adminName,
        email,
        password,
        plan:
          plan || "Monthly",
        expiryDate,
        isActive: true,
      });

    res.status(201).json({
      success: true,
      message:
        "Company Created Successfully",
      company,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
});

// =================================
// COMPANY LOGIN
// =================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const company =
      await Company.findOne({
        email,
      });

    if (!company) {
      return res.status(404).json({
        message:
          "Company Not Found",
      });
    }

    if (
      company.password !==
      password
    ) {
      return res.status(401).json({
        message:
          "Invalid Password",
      });
    }

    if (
      company.isActive === false
    ) {
      return res.status(403).json({
        message:
          "Company Disabled By Super Admin",
      });
    }

    if (
      new Date() >
      new Date(
        company.expiryDate
      )
    ) {
      return res.status(403).json({
        message:
          "Subscription Expired",
      });
    }

    res.json({
      success: true,
      message:
        "Login Successful",
      company: {
        _id: company._id,
        companyName:
          company.companyName,
        adminName:
          company.adminName,
        email:
          company.email,
        plan:
          company.plan,
        expiryDate:
          company.expiryDate,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
});

// =================================
// GET ALL COMPANIES
// =================================
router.get("/all", async (req, res) => {
  try {
    const companies =
      await Company.find().sort({
        createdAt: -1,
      });

    res.json(companies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
});

// =================================
// GET SINGLE COMPANY
// =================================
router.get("/:id", async (req, res) => {
  try {
    const company =
      await Company.findById(
        req.params.id
      );

    if (!company) {
      return res.status(404).json({
        message:
          "Company Not Found",
      });
    }

    res.json(company);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
});

// =================================
// UPDATE COMPANY
// =================================
router.put(
  "/update/:id",
  async (req, res) => {
    try {
      const company =
        await Company.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      if (!company) {
        return res.status(404).json({
          message:
            "Company Not Found",
        });
      }

      res.json({
        success: true,
        message:
          "Company Updated Successfully",
        company,
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
// ENABLE COMPANY
// =================================
router.put(
  "/enable/:id",
  async (req, res) => {
    try {
      const company =
        await Company.findByIdAndUpdate(
          req.params.id,
          {
            isActive: true,
          },
          {
            new: true,
          }
        );

      res.json({
        success: true,
        message:
          "Company Enabled Successfully",
        company,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// DISABLE COMPANY
// =================================
router.put(
  "/disable/:id",
  async (req, res) => {
    try {
      const company =
        await Company.findByIdAndUpdate(
          req.params.id,
          {
            isActive: false,
          },
          {
            new: true,
          }
        );

      res.json({
        success: true,
        message:
          "Company Disabled Successfully",
        company,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// RENEW SUBSCRIPTION
// =================================
router.put(
  "/renew/:id",
  async (req, res) => {
    try {
      const {
        expiryDate,
      } = req.body;

      const company =
        await Company.findByIdAndUpdate(
          req.params.id,
          {
            expiryDate,
            isActive: true,
          },
          {
            new: true,
          }
        );

      res.json({
        success: true,
        message:
          "Subscription Renewed Successfully",
        company,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// DELETE COMPANY
// =================================
router.delete(
  "/delete/:id",
  async (req, res) => {
    try {
      const company =
        await Company.findByIdAndDelete(
          req.params.id
        );

      if (!company) {
        return res.status(404).json({
          message:
            "Company Not Found",
        });
      }

      res.json({
        success: true,
        message:
          "Company Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports = router;