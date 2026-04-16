const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: Number,
    genre: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    bookLanguage: String,
    publisher: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Publisher",
},
    image: String,
    rating: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    reviews: [
      {
        user: String,
        comment: String,
        rating: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);