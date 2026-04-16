const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const auth = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// PUBLIC
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// PROTECTED
router.post("/", auth, upload.single("image"), createCategory);

// ADMIN ONLY
router.put("/:id", auth,  upload.single("image"), updateCategory);
router.delete("/:id", auth,  deleteCategory);

module.exports = router;