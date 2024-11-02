const mongoose = require("mongoose");

// const PropertySchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   images: [
//     {
//       type: String,
//     },
//   ],
//   agent: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
// });

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    squareFeet: {
      type: Number,
      required: [true, "Square footage is required"],
      min: [0, "Square footage cannot be negative"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [0, "Bedrooms cannot be negative"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [0, "Bathrooms cannot be negative"],
    },
    garage: {
      type: String,
      enum: [
        "none",
        "1-car attached",
        "2-car attached",
        "3-car attached",
        "detached",
      ],
      default: "none",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [1, "Description must be at least 10 characters long"],
    },
    features: [
      {
        type: String,
      },
    ],
    images: [
      {
        url: String,
        subtitle: String,
      },
    ],
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "pending"],
      default: "available",
    },
    availability: {
      type: Boolean,
      default: true,
    },
    tours: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
      },
    ],
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReviewRating",
      },
    ],
  },

  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;

// const Property = mongoose.model('Property', PropertySchema);
// module.exports = Property;
