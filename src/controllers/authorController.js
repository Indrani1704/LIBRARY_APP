const Author = require("../models/Author");

// @desc    Create Author
// @route   POST /api/authors
// @access  Admin
exports.createAuthor = async (req, res) => {
  try {
    const { name, isClassic } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Author name is required",
      });
    }

    const author = await Author.create({
      name,
      isClassic: isClassic || false,
      image: req.file ? req.file.path : "",
    });

    res.status(201).json({
      success: true,
      message: "Author created successfully",
      data: author,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get All Authors
// @route   GET /api/authors
// @access  Public
exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort("-createdAt");

    res.status(200).json({
      success: true,
      count: authors.length,
      data: authors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// OPTIONAL (recommended for future)

// @desc    Get Single Author
// @route   GET /api/authors/:id
exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    res.status(200).json({
      success: true,
      data: author,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Author
// @route   PUT /api/authors/:id
exports.updateAuthor = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const author = await Author.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Author updated successfully",
      data: author,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete Author
// @route   DELETE /api/authors/:id
exports.deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Author deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};