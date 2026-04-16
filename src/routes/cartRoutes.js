const router = require("express").Router();
const Cart = require("../models/Cart");
const auth = require("../middleware/authMiddleware");

// ================= GET CART =================
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user })
      .populate({
        path: "bookId",
        populate: { path: "author" }, // optional
      });

    res.json(cart);
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= ADD / INCREASE =================
router.post("/add", auth, async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ msg: "Book ID required" });
    }

    const exists = await Cart.findOne({
      user: req.user,
      bookId,
    });

    if (exists) {
      exists.quantity += 1;
      await exists.save();
    } else {
      await Cart.create({
        user: req.user,
        bookId,
        quantity: 1,
      });
    }

    res.json({ msg: "Added to cart" });
  } catch (err) {
    console.error("ADD CART ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= DECREASE =================
router.put("/decrease/:id", auth, async (req, res) => {
  try {
    const item = await Cart.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    item.quantity -= 1;

    if (item.quantity <= 0) {
      await item.deleteOne();
      return res.json({ msg: "Item removed" });
    }

    await item.save();

    res.json(item);
  } catch (err) {
    console.error("DECREASE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= REMOVE =================
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Item not found" });
    }

    res.json({ msg: "Item removed" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= CLEAR CART (OPTIONAL) =================
router.delete("/clear/all", auth, async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user });
    res.json({ msg: "Cart cleared" });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;