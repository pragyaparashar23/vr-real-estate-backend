const mongoose = require("mongoose");

const ReviewRatingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewRating = mongoose.model("ReviewRating", ReviewRatingSchema);
module.exports = ReviewRating;
