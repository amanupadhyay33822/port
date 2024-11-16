const Appointment = require("../models/Appointment"); // Adjust path as necessary
const User = require("../models/User"); // Adjust path as necessary
const nodemailer = require("nodemailer");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Function to send an email
async function sendEmail(appointmentDetails) {
  const mailOptions = {
    from: "akangkhasarkar@gmail.com", // Replace with your email
    to: appointmentDetails.email,
    subject: "Appointment Confirmation",
    text: `Dear ${appointmentDetails.fullName},
    
    Thank you for scheduling an appointment. Below are the details:

    - **Phone:** ${appointmentDetails.phone}
    - **Budget:** ${appointmentDetails.budget}
    - **Message:** ${appointmentDetails.message || "N/A"}
    - **Age Confirmation:** ${appointmentDetails.ageConfirmation ? "Yes" : "No"}
    - **Newsletter Subscription:** ${
      appointmentDetails.newsletterSubscription ? "Subscribed" : "Not Subscribed"
    }

    Please contact us if you have any questions.

    Best regards,
    Your Company`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

// Controller for creating an appointment
const createAppointment = async (req, res) => {
  try {
    const {
      id, // User ID
      fullName,
      email,
      phone,
      budget,
      message,
      ageConfirmation,
      newsletterSubscription,
    } = req.body;

    const userId = req.body.id;
    console.log(req.body);

    // Create a new appointment
    const newAppointment = new Appointment({
      fullName,
      email,
      phone,
      budget,
      message,
      ageConfirmation,
      newsletterSubscription,
    });

    console.log(newAppointment);

    // Save the appointment to the database
    const savedAppointment = await newAppointment.save();

    // Update the user schema to save the appointment ID
    await User.findByIdAndUpdate(userId, {
      $push: { appointments: savedAppointment._id },
    });

    // Send confirmation email
    await sendEmail(savedAppointment);

    return res.status(201).json({
      message: "Appointment created successfully!",
      appointmentId: savedAppointment._id,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Controller for retrieving all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});

    return res.status(200).json({
      success: true,
      appointments,
      message: "Appointments retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export the controller functions
module.exports = { createAppointment, getAllAppointments };
