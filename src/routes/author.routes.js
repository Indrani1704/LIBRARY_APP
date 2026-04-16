const express = require("express");
const router = express.Router();


const {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getAuthors);
router.post("/", auth, upload.single("image"), createAuthor);

router.put("/:id", auth, upload.single("image"), updateAuthor);
router.delete("/:id", auth, deleteAuthor);
module.exports = router;