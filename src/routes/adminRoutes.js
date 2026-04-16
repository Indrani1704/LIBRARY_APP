const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/dashboard", auth, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin Dashboard"
  });
});

module.exports = router;