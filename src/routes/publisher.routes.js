const express = require("express");
const router = express.Router();

const {
  createPublisher,
  getPublishers,
  getPublisherById,
  updatePublisher,
  deletePublisher,
} = require("../controllers/publisherController");

const auth = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// PUBLIC
router.get("/", getPublishers);
router.get("/:id", getPublisherById);

// PROTECTED
router.post("/", auth, upload.single("image"), createPublisher);

// ADMIN ONLY
router.put("/:id", auth, upload.single("image"), updatePublisher);
router.delete("/:id", auth,  deletePublisher);

module.exports = router;