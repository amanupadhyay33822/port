const Contact = require("../models/Contact"); // Adjust the path to your Contact model

// Controller function to create a new contact
exports.createContact = async (req, res) => {
  try {
    // Destructure the request body to get contact data
    const { fullName, email, phone, budget, message } = req.body;

    // Validating data
    if (!fullName || !email || !phone || !budget ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create a new contact instance
    const newContact = new Contact({
      fullName,
      email,
      phone,
      budget,
      message,
    });

    // Save the contact to the database
    await newContact.save();

    // Respond with the created contact data
    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      contact: newContact,
    });
  } catch (error) {
    // Handle errors and send appropriate responses
    if (error.code === 11000) {
      // MongoDB duplicate key error (e.g., duplicate email)
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Log the error for debugging
    console.error(error);

    // General server error response
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
