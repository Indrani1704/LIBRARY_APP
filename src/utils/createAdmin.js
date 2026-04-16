// utils/createAdmin.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  const adminExists = await User.findOne({ email: "admin@gmail.com" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log(" Admin created");
  }
};

module.exports = createAdmin;