require("dotenv").config();

const mongoose = require("mongoose");
const SuperAdmin = require("./models/SuperAdmin");

mongoose.connect(process.env.MONGO_URI);

async function createSuperAdmin() {
  try {
    const existing =
      await SuperAdmin.findOne({
        username:
          process.env.SUPER_ADMIN_EMAIL,
      });

    if (existing) {
      console.log(
        "Super Admin Already Exists"
      );
      process.exit();
    }

    await SuperAdmin.create({
      username:
        process.env.SUPER_ADMIN_EMAIL,
      password:
        process.env.SUPER_ADMIN_PASSWORD,
    });

    console.log(
      "Super Admin Created Successfully"
    );

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
}

createSuperAdmin();