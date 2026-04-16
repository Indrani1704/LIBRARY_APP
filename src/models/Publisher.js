const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Publisher", publisherSchema);