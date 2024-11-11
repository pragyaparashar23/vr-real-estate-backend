const Property = require("../models/Property");
const ReviewRating = require("../models/Reviewrrating");
const Tour = require("../models/Tour");

// exports.createProperty = async (req, res) => {
//   const { title, description, price, location, images } = req.body;
//   try {
//     const property = new Property({
//       title,
//       description,
//       price,
//       location,
//       images,
//       agent: req.user.id,
//     });
//     await property.save();
//     res.json(property);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getProperties = async (req, res) => {
//   try {
//     const properties = await Property.find().populate("agent", "name email");
//     res.json(properties);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getProperty = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id).populate(
//       "agent",
//       "name email"
//     );
//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }
//     res.json(property);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.updateProperty = async (req, res) => {
//   const { title, description, price, location, images } = req.body;
//   try {
//     let property = await Property.findById(req.params.id);
//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     property.title = title || property.title;
//     property.description = description || property.description;
//     property.price = price || property.price;
//     property.location = location || property.location;
//     property.images = images || property.images;

//     await property.save();
//     res.json(property);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.deleteProperty = async (req, res) => {
//   try {
//     let property = await Property.findById(req.params.id);
//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     await property.remove();
//     res.json({ message: "Property removed" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.sendBookingConfirmationEmail = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id).populate(
//       "agent",
//       "name email"
//     );
//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     // Send booking confirmation email
//     // You can use any email service provider or library to send the email
//     // Here's an example using nodemailer
//     const nodemailer = require("nodemailer");
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "your_email@gmail.com",
//         pass: "your_password",
//       },
//     });
//     let mailOptions = {
//       from: "your_email@gmail.com",
//       to: property.agent.email,
//       subject: "Booking Confirmation",
//       text: `Dear ${property.agent.name}, your property ${property.title} has been booked.`,
//     };
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });

//     res.json({ message: "Booking confirmation email sent" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// new apis
// Create new property

const getImageUrl = (filepath) => {
  // Convert windows path separators to URL format
  const relativePath = filepath.split("images")[1].replace(/\\/g, "");
  return relativePath;
};

exports.createProperty = async (req, res) => {
  try {
    const imageUrls = [];
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    if (req.files && req.files.length > 0) {
      imageUrls.push(
        ...req.files.map((file) => ({
          url: getImageUrl(file.path),
          filepath: file.path,
          subtitle: file.originalname,
        }))
      );
    }

    const propertyData = {
      ...req.body,
      images: imageUrls,
      agent: req.params.id,
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).sort("-createdAt");
    console.log("properties", properties);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single property
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("agent", "name email")
      .populate("ratings", "rating review");

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
      });
    }

    const getRating = await ReviewRating.find({ property: req.params.id });

    res.status(200).json({
      success: true,
      data: { property, getRating },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
      });
    }

    // Check if user is property agent
    if (property.agent.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this property",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found",
      });
    }
    // Check if user is property agent
    if (property.agent.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this property",
      });
    }

    await property.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getPropertyTourScheduleByBuyers = async (req, res) => {
  try {
    const tours = await Tour.find({ property: req.params.id })
      .populate("property", "title address price images agent")
      .populate("buyer", "name email")
      .populate("agent", "name email");

    res.status(200).json({
      success: true,
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deactivateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
