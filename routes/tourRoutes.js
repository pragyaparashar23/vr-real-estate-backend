const express = require("express");
const router = express.Router();
const {
  scheduleTour,
  getTours,
  getTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, scheduleTour);
router.get("/tourlist", getTours);
router.get("/tour/:id", getTour);
router.put("/update/tour/:id", authMiddleware, updateTour);
router.delete("/tour/delete/:id", authMiddleware, deleteTour);

module.exports = router;
