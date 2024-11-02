const Tour = require("../models/Tour");
const Property = require("../models/Property");
const sendEmail = require("../middleware/sendEmail");
const User = require("../models/User");
const ReviewRating = require("../models/Reviewrrating");

exports.scheduleTour = async (req, res) => {
  const { date } = req.body;
  console.log("params", req.params);
  try {
    const property = await Property.findById(req.params.propertyId);
    const existingTours = await Tour.find({
      property: req.params.propertyId,
      date,
      status: "scheduled" || "visiting",
    });
    if (existingTours.length > 0) {
      return res
        .status(200)
        .json({ message: "Property already booked for the selected date" });
    }
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const tour = new Tour({
      property: req.params.propertyId,
      buyer: req.params.userId,
      agent: property.agent,
      date,
    });
    await tour.save();
    const agent = await User.find({ _id: property.agent });
    const buyer = await User.find({ _id: req.params.userId });

    // Email to Agent
    const agentEmail = {
      to: agent[0].email,
      subject: "New Tour Scheduled",
      text: `A new tour has been scheduled for property ${property.title} on ${date} at ${property.address}.`,
      html: `<h2>A new tour has been scheduled for property ${property.title} on ${date} at ${property.address}.</h2>`,
    };

    // Email to Buyer
    const buyerEmail = {
      to: buyer[0].email,
      subject: "Tour Scheduled",
      text: `Your tour for property ${property.title} has been scheduled on ${date} at ${property.address}.`,
      html: `<h2>Your tour for property ${property.title} has been scheduled on ${date} at ${property.address}.</h2>`,
    };

    // Assuming there's a function to send emails
    sendEmail(agentEmail);
    if (buyer[0].notificationPreference) {
      sendEmail(buyerEmail);
    }
    res.json(tour);
  } catch (err) {
    console.log("Error in scheduleTour", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find()
      .populate("property", "title address ratings")
      .populate("buyer", "name email")
      .populate("agent", "name email");
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.find({ buyer: req.params.userId })
      .populate("property", "title address price images description ratings")
      .populate("buyer", "name email")
      .populate("agent", "name email")
      .populate("rating", "rating review");
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTour = async (req, res) => {
  const { date, status } = req.body;
  try {
    let tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    tour.date = date || tour.date;
    tour.status = status || tour.status;

    await tour.save();
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    tour.status = "cancelled"; // Assuming the intention is to cancel the tour upon deletion
    await tour.save();
    res.json({ message: "Tour removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.cancelTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id).populate("property", "title");
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, {
      status: "cancelled",
      cancelledBy: "buyer",
    });

    const agent = await User.find({ _id: tour.agent });
    const buyer = await User.find({ _id: tour.buyer });

    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    sendEmail({
      to: agent[0].email,
      subject: "Tour Cancelled",
      text: `The tour for property ${tour.property.title} has been cancelled by buyer.`,
    });
    sendEmail({
      to: buyer[0].email,
      subject: "Tour Cancelled",
      text: `The tour for property ${tour.property.title} has been cancelled.`,
    });
    res.json({ message: "Tour cancelled" });
  } catch (err) {
    console.log("Error in cancelTour", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkSchedule = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      property: req.params.propertyId,
      buyer: req.params.userId,
      // date: { $gte: new Date() },
      status: "scheduled",
    });
    res.json({ tourExists: tour ? true : false, tour });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getToursOfAgent = async (req, res) => {
  try {
    const tours = await Tour.find({ agent: req.params.agentId })
      .populate("property", "title address price images description ratings")
      .populate("buyer", "name email")
      .populate("rating", "rating review");
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelTourAgent = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id).populate("property", "title");
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, {
      status: "cancelled",
      cancelledBy: "agent",
    });

    const agent = await User.find({ _id: tour.agent });
    const buyer = await User.find({ _id: tour.buyer });

    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    sendEmail({
      to: agent[0].email,
      subject: "Tour Cancelled",
      text: `The tour for property ${tour.property.title} has been cancelled by agent.`,
    });
    sendEmail({
      to: buyer[0].email,
      subject: "Tour Cancelled",
      text: `The tour for property ${tour.property.title} has been cancelled.`,
    });
    res.json({ message: "Tour cancelled" });
  } catch (err) {
    console.log("Error in cancelTour", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.visitProperty = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id).populate("property", "title");
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, {
      status: "visiting",
    });

    const agent = await User.find({ _id: tour.agent });
    const buyer = await User.find({ _id: tour.buyer });

    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    sendEmail({
      to: agent[0].email,
      subject: "Tour Started",
      text: `The tour for property ${tour.property.title} has been started by ${buyer[0].name}.`,
    });
    if (buyer[0].notificationPreference) {
      sendEmail({
        to: buyer[0].email,
        subject: "Tour Started",
        text: `The tour for property ${tour.property.title} has been started.`,
      });
    }
    res.json({ message: "Tour started" });
  } catch (err) {
    console.log("Error in visitProperty", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.completeTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id).populate("property", "title");
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, {
      status: "completed",
    });

    const agent = await User.find({ _id: tour.agent });
    const buyer = await User.find({ _id: tour.buyer });

    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    sendEmail({
      to: agent[0].email,
      subject: "Tour Completed",
      text: `The tour for property ${tour.property.title} has been completed by ${buyer[0].name}.`,
    });
    if (buyer[0].notificationPreference) {
      sendEmail({
        to: buyer[0].email,
        subject: "Tour Completed",
        text: `The tour for property ${tour.property.title} has been completed.`,
      });
    }
    res.json({ message: "Tour completed" });
  } catch (err) {
    console.log("Error in completeTour", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rateTour = async (req, res) => {
  try {
    console.log("req.params", req.params);
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const rating = new ReviewRating({
      property: tour.property._id || tour.property,
      reviewer: tour.buyer._id || tour.buyer,
      review: req.params.review,
      rating: Number(req.params.rating),
      tour: tour._id,
    });
    const savedRating = await rating.save();
    if (!savedRating) {
      return res.status(404).json({ message: "Rating not saved" });
    }
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, {
      isRated: true,
    });

    res.json({ message: "Tour rated" });
  } catch (err) {
    console.log("Error in rateTour", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRating = async (req, res) => {
  try {
    const rating = await ReviewRating.find({ reviewer: req.params.id });
    res.json(rating);
  } catch (err) {
    console.log("Error in getRating", err);
    res.status(500).json({ message: "Server error" });
  }
};
