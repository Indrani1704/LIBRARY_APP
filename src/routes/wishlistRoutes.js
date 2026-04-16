const router = require("express").Router();
const Wishlist = require("../models/Wishlist");
const auth = require("../middleware/authMiddleware");

// ================= GET =================
router.get("/", auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user })
      .populate({
        path: "bookId",
        populate: { path: "author" },
      });

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= ADD =================
router.post("/add", auth, async (req, res) => {
  try {
    const { bookId } = req.body;

    const exists = await Wishlist.findOne({
      user: req.user,
      bookId,
    });

    if (!exists) {
      await Wishlist.create({
        user: req.user,
        bookId,
      });
    }

    res.json({ msg: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= REMOVE =================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    res.json({ msg: "Removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;