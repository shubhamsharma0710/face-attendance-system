require("dotenv").config();

const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");

const Admin =
  require("./models/Admin");

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(async () => {
    try {
      const existingAdmin =
        await Admin.findOne({
          username:
            "admin@codeyart.in",
        });

      if (existingAdmin) {
        console.log(
          "Admin Already Exists"
        );

        process.exit();
      }

      const hashedPassword =
        await bcrypt.hash(
          "Codeyart@123",
          10
        );

      await Admin.create({
        username:
          "admin@codeyart.in",

        password:
          hashedPassword,

        role:
          "SUPER_ADMIN",
      });

      console.log(
        "Admin Created Successfully"
      );

      process.exit();
    } catch (error) {
      console.log(error);

      process.exit();
    }
  })
  .catch((err) => {
    console.log(err);
  });