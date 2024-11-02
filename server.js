const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const tourRoutes = require("./routes/tourRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
dotenv.config();

const app = express();

const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/images", express.static(path.join(__dirname, "./images")));

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow your frontend origin
    // origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies if you're using them
  })
);

app.use(express.json());
app.use(bodyParser.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
