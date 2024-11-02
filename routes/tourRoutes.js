const express = require("express");
const router = express.Router();
const {
  scheduleTour,
  getTours,
  getTour,
  updateTour,
  deleteTour,
  checkSchedule,
  cancelTour,
  visitProperty,
  completeTour,
  rateTour,
  getRating,
  getToursOfAgent,
  cancelTourAgent,
} = require("../controllers/tourController");
const { authMiddleware } = require("../middleware/authMiddleware");
// http://localhost:5000/api/tours/schedule/tour/6721c2e68de57b5a19bc9c13/672191f33880a290997183a5

router.post("/schedule/:propertyId/:userId", scheduleTour);
router.get("/tourlist", getTours);
router.get("/tour/:id", getTour);
router.put("/update/tour/:id", authMiddleware, updateTour);
router.delete("/tour/delete/:id", authMiddleware, deleteTour);
router.get("/checkSchedule/:propertyId/:userId", checkSchedule);
router.get("/userTours/:userId", getTour);
router.get("/cancelTour/:id", cancelTour);
router.get("/visitProperty/:id", visitProperty);
router.get("/completeTour/:id", completeTour);
router.get("/rateTour/:id/:rating/:review", rateTour);
router.get("/getRating/:id", getRating);
router.get("/agentTours/:agentId", getToursOfAgent);
router.get("/cancelTourAgent/:id", cancelTourAgent);
module.exports = router;
