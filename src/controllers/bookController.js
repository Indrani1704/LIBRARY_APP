const Book = require("../models/Books");

// @desc    Create Book
// @route   POST /api/books
// @access  Admin

const mongoose = require("mongoose");

// @desc    Create Book
exports.createBook = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      description,
      price,
      genre,
      bookLanguage,
      publisher,
      author,
      category,
      isBestSeller,
    } = req.body;

    //  VALIDATION
    if (!title || !author || !category || !publisher) {
      return res.status(400).json({
        success: false,
        message: "Title, Author, Category and Publisher are required",
      });
    }

    //  VALID OBJECTID CHECK
    if (
      !mongoose.Types.ObjectId.isValid(author) ||
      !mongoose.Types.ObjectId.isValid(category) ||
      !mongoose.Types.ObjectId.isValid(publisher)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Author / Category / Publisher ID",
      });
    }

    const data = {
      title,
      description,
      price: Number(price), 
      genre,
      bookLanguage,
      author,
      category,
      publisher,
      isBestSeller: isBestSeller === "true", 
      image: req.file?.path || "",
    };

    console.log("FINAL DATA:", data);

    const book = await Book.create(data);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get All Books (Filter + Search + Pagination)
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    const {
      genre,
      category,
      search,
      sort,
      page = 1,
      limit = 1000, 
      bookLanguage,
      publisher,
    } = req.query;

    let query = {};

    /*  GENRE (case-insensitive) */
    if (genre) {
      query.genre = { $regex: `^${genre}$`, $options: "i" };
    }

    /*  LANGUAGE FIX */
    if (bookLanguage) {
      query.bookLanguage = { $regex: `^${bookLanguage}$`, $options: "i" };
    }

    /*  PUBLISHER FIX */
    if (publisher) {
      query.publisher = publisher;
    }

    if (category) query.category = category;

    if (req.query.isBestSeller) {
      query.isBestSeller = req.query.isBestSeller === "true";
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    let booksQuery = Book.find(query)
      .populate("author")
      .populate("category")
      .populate("publisher");

    /*  SORT */
    if (sort === "latest") booksQuery = booksQuery.sort("-createdAt");
    else if (sort === "price") booksQuery = booksQuery.sort("price");
    else booksQuery = booksQuery.sort("-createdAt");

    const books = await booksQuery;

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Book
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("author")
      .populate("category")
      .populate("publisher");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Book
// @route   PUT /api/books/:id
// @access  Admin
exports.updateBook = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    if (req.file) data.image = req.file.path;

    const book = await Book.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Book
// @route   DELETE /api/books/:id
// @access  Admin
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

