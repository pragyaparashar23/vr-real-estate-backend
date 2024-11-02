const multer = require("multer");

// Ensure the images directory exists before uploading
const fs = require("fs");
const path = require("path");
const imagesDir = path.join(__dirname, "../images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir); // Use the images directory
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    const extension = file.mimetype.split("/").pop();
    console.log("extension", extension);
    const newFilename = Date.now() + "--" + file.originalname;
    cb(null, newFilename + "." + extension);
  },
});

// Add limits to the file size if necessary
const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

module.exports = { upload };
