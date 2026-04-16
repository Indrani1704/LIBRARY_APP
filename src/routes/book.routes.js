const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Public Routes
router.get("/", getBooks);
router.get("/:id", getBookById);

// Admin Routes
router.post("/", auth, upload.single("image"), createBook);
router.put("/:id", auth, upload.single("image"), updateBook);
router.delete("/:id", auth, deleteBook);

module.exports = router;