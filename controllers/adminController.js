const Property = require("../models/Property");
const ReviewRating = require("../models/Reviewrrating");
const Tour = require("../models/Tour");
const User = require("../models/User");

exports.adminDashboard = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    const properties = await Property.find();
    const tours = await Tour.find()
      .populate(
        "property",
        "title agent buyer description address images price squareFeet bedrooms bathrooms"
      )
      .populate("agent", "name email")
      .populate("buyer", "name email");
    const ratingsAndReviews = await ReviewRating.find()
      .populate("property", "title")
      .populate("reviewer", "name email");

    res.status(200).json({
      success: true,
      data: { users, properties, tours, ratingsAndReviews },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.manageUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    if (action === "delete") {
      await User.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } else if (action === "update") {
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid action",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.manageProperties = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    if (action === "delete") {
      await Property.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Property deleted successfully",
      });
    } else if (action === "update") {
      const property = await Property.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({
        success: true,
        data: property,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid action",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.manageTours = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    if (action === "delete") {
      await Tour.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Tour deleted successfully",
      });
    } else if (action === "update") {
      const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({
        success: true,
        data: tour,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid action",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.viewRatingsAndReviews = async (req, res) => {
  try {
    const ratingsAndReviews = await ReviewRating.find()
      .populate("property", "title")
      .populate("reviewer", "name email");
    res.status(200).json({
      success: true,
      data: ratingsAndReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.manageRatingsAndReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    if (action === "delete") {
      await ReviewRating.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Rating and review deleted successfully",
      });
    } else if (action === "update") {
      const ratingAndReview = await ReviewRating.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        success: true,
        data: ratingAndReview,
      });
    } else if (action === "respond") {
      const ratingAndReview = await ReviewRating.findByIdAndUpdate(
        id,
        { response: req.body.response },
        { new: true }
      );
      res.status(200).json({
        success: true,
        data: ratingAndReview,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid action",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// delete property

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// delete tour
exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// delete rating and review
exports.deleteRatingAndReview = async (req, res) => {
  try {
    const { id } = req.params;
    await ReviewRating.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Rating and review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
