const express = require("express");
const router = express.Router();
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  deactivateProperty,
} = require("../controllers/propertyController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/imageUpload");

router.post("/create/property/:id", upload.array("images", 5), createProperty);
router.get("/propertyList", getProperties);
router.get("/property/:id", getProperty);
router.put("/update/property/:id", authMiddleware, updateProperty);
router.delete("/delete/property/:id", authMiddleware, deleteProperty);
router.put("/deactivate/property/:id", deactivateProperty);

module.exports = router;
