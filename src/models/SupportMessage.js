const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: String,
    sender: String, // "user" | "admin"
    userId: String,
    userName: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportMessage", messageSchema);