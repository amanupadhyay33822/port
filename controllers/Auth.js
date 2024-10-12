const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const router = express.Router();

exports.signup = async (req, res) => {
  try {
    // Check if user already exists
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${username}`,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validating data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "ALL FIELDS ARE REQUIRED",
      });
    }
    // Checking user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered !!",
      });
    }

    // Check password
    // Matching password and generating JWT token
    if (await bcrypt.compare(password, user.password)) {
      // Creating payload
      const payload = {
        email: user.email,
        id: user._id,
      };

      // Generating JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "36d", // Token expiry
      });

      // Set token in user object for response
      user.password = undefined; // Don't send password in response

      // Creating cookie and sending final response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie expiry
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "LOGGED IN SUCCESSFULLY",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password doesn't match !!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      res.clearCookie("token");
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "token is not found !!",
      });
    }
    // Send a response indicating success
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while logging out. Please try again.",
    });
  }
};

// Add a purchased product to user's itemsBought list

