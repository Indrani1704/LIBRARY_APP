const Publisher = require("../models/Publisher");

// CREATE
exports.createPublisher = async (req, res) => {
  try {
    const publisher = await Publisher.create({
      name: req.body.name,
      image: req.file ? req.file.path : "",
    });

    res.status(201).json({
      success: true,
      data: publisher,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
exports.getPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find();

    res.json({
      success: true,
      data: publishers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get Single Publisher
// @route   GET /api/publishers/:id
exports.getPublisherById = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found",
      });
    }

    res.status(200).json({
      success: true,
      data: publisher,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update Publisher
// @route   PUT /api/publishers/:id
exports.updatePublisher = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const publisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Publisher updated successfully",
      data: publisher,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete Publisher
// @route   DELETE /api/publishers/:id
exports.deletePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndDelete(
      req.params.id
    );

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Publisher deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};