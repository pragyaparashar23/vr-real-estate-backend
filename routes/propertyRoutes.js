const express = require("express");
const router = express.Router();
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create/property", authMiddleware, createProperty);
router.get("/propertyList", getProperties);
router.get("/property/:id", getProperty);
router.put("/update/property/:id", authMiddleware, updateProperty);
router.delete("/delete/property/:id", authMiddleware, deleteProperty);

module.exports = router;
