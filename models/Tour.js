const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled", "visiting"],
    default: "scheduled",
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isRated: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReviewRating",
  },
  cancelledBy: {
    type: String,
    enum: ["buyer", "agent"],
    default: "buyer",
  },
});

const Tour = mongoose.model("Tour", TourSchema);
module.exports = Tour;
