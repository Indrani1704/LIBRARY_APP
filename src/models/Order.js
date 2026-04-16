const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        bookId: String,
        title: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    totalAmount: Number,

    razorpay_order_id: String,
    razorpay_payment_id: String,

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);