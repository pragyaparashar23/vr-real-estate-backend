const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};
// Middleware to verify JWT
const jwtAuth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};
const buyerOnly = (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res
      .status(403)
      .json({ message: "Access forbidden: Freelancers only" });
  }
  next();
};

const agentOnly = (req, res, next) => {
  if (req.user.role !== "agent") {
    return res.status(403).json({ message: "Access forbidden: Clients only" });
  }
  next();
};

module.exports = { authMiddleware, jwtAuth, agentOnly, buyerOnly };
