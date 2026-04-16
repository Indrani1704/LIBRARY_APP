const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  createOrder,
  verifyPayment,
  getMyOrders,
} = require("../controllers/paymentController");

const auth = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const Order = require("../models/Order");


router.post("/create", auth, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user })
      .populate("bookId");

    if (!cartItems.length) {
      return res.status(400).json({ msg: "Cart empty" });
    }

    const items = cartItems.map((c) => ({
      bookId: c.bookId._id.toString(),
      title: c.bookId.title,
      price: c.bookId.price,
      image: c.bookId.image,
      quantity: c.quantity,
    }));

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.bookId.price,
      0
    );

    const order = await Order.create({
      user: req.user,
      items,
      totalAmount,
      status: "paid",
    });

    await Cart.deleteMany({ user: req.user });

    res.json(order);
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ msg: "Order failed" });
  }
});


router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);
router.get("/my-orders", auth, getMyOrders);

module.exports = router;