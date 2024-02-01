// Import mongoose
const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
require("dotenv").config();

// Define the admin schema using mongoose.Schema
const userSchema = new mongoose.Schema(
  {
    fkUserId: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
      // immutable: true,
    },
    strEmail: {
      type: String,
      required: [true, "Email is required"], // Email field is required
      unique: true,
      validate: {
        // Validate that the email is in a valid format
        validator: (value) => validator.isEmail(value),
        message: "Invalid email", // Error message if the email is invalid
      },
      createIndexes: { unique: true }, // Create unique index for email field
    },
    strName: {
      type: String,
      required: [true, "Name is required"], // Name field is required
    },
    strPassword: {
      type: String,
      required: [true, "Password is required"], // Password field is required
    },
    strPhone: {
      type: String,
      required: [true, "phone number is required"], // Password field is required
    },
    strCountry: {
      type: String,

      required: [true, "Country is required"], // Password field is required
    },
  },

  // {
  //   timestamps: true, // Add timestamps for createdAt and updatedAt fields
  // }

  {
    timestamps: {
      currentTime: () =>
        new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }),
    },
  }
);

//login schmea
const user = mongoose.model(process.env.USER_COLLECTION, userSchema);

module.exports = { user };
