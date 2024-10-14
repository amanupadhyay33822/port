const Appointment = require("../models/Appointment"); // Adjust path as necessary
const User = require("../models/User"); // Adjust path as necessary
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    pass: process.env.MAIL_PASS,
    user: process.env.MAIL_USER,
  },
});

// Function to send email
async function sendEmail(appointmentDetails) {
  const mailOptions = {
    from: "amanupadhyay33822@gmail.com", // Your email address
    to: "amanu0181@gmail.com", // Seller's email address
    subject: "New Digital Art Appointment Confirmation",
    text: `Dear [Owner's Name],
    
    We are pleased to inform you that a new appointment for creating digital art has been successfully scheduled. Below are the details of the appointment:
    
    **Appointment Details:**
    
    - **Name:** ${appointmentDetails.name}
    - **Email:** ${appointmentDetails.email}
    - **Phone Number:** ${appointmentDetails.phoneNumber}
    - **Genre:** ${appointmentDetails.genre}
    - **Residency Status:** ${appointmentDetails.residencyStatus}
    - **Available Days:** ${appointmentDetails.availableDays.join(", ")}
    - **Placement:** ${appointmentDetails.placement}
    - **Size Estimate:**
      - Weight: ${appointmentDetails.sizeEstimate.weight} kg
      - Height: ${appointmentDetails.sizeEstimate.height} cm
    - **Color Preference:** ${appointmentDetails.color}
    - **Design Description:** ${appointmentDetails.designDescription}
    
    Please review the above details and prepare for the appointment accordingly. If you have any questions or require further information, feel free to reach out.
    
    Thank you!
    
    Best regards,`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

const createAppointment = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      genre,
      residencyStatus,
      availableDays,
      placement,
      sizeEstimate,
      color,
      designDescription,
    } = req.body;
    const userId = req.user.id;
    // Create a new appointment
    const newAppointment = new Appointment({
      name,
      email,
      phoneNumber,
      genre,
      residencyStatus,
      availableDays,
      placement,
      sizeEstimate,
      color,
      designDescription,
    });

    // Save the appointment to the database
    const savedAppointment = await newAppointment.save();

    // Update the user schema to save the appointment ID
    await User.findByIdAndUpdate(userId, {
      $push: { appointments: savedAppointment._id },
    });

    // Send an email to the seller (you need to configure nodemailer)

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

const getallAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    
    return res.status(200).json({
        success: true,
        appointments,
        message: "User registered successfully",
      });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message,
      });
  }
};

module.exports = { createAppointment ,getallAppointments};
