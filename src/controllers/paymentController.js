const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const mongoose = require("mongoose");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VERIFY + SAVE ORDER
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Payment failed" });
    }

    //  ONLY VERIFY
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET USER ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user); 

    //  SAFE conversion
    const userId = mongoose.Types.ObjectId.isValid(req.user)
      ? new mongoose.Types.ObjectId(req.user)
      : req.user;

    const orders = await Order.find({ user: userId })
      .populate({
        path: "items.bookId",
        populate: { path: "author" },
      })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.error("GET ORDERS ERROR:", err); 
    res.status(500).json({ error: err.message });
  }
};