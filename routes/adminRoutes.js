const { authMiddleware } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const {
  adminDashboard,
  manageUsers,
  manageProperties,
  manageTours,
  viewRatingsAndReviews,
  manageRatingsAndReviews,
  deleteUser,
  deleteProperty,
  deleteTour,
  deleteRatingAndReview,
} = require("../controllers/adminController");

router.get("/dashboard", adminDashboard);
router.get("/manageUsers/:id", manageUsers);
router.get("/manageProperties/:id", manageProperties);
router.get("/manageTours/:id", manageTours);
router.get("/viewRatingsAndReviews/:id", viewRatingsAndReviews);
router.get("/manageRatingsAndReviews/:id", manageRatingsAndReviews);

// delete user
router.get("/deleteUser/:id", deleteUser);

// delete property
router.get("/deleteProperty/:id", deleteProperty);

// delete tour
router.get("/deleteTour/:id", deleteTour);

// delete rating and review
router.get("/deleteRatingAndReview/:id", deleteRatingAndReview);

module.exports = router;
