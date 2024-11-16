const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  budget: { type: String, required: true },
  message: { type: String },
  ageConfirmation: { type: Boolean,  },
  newsletterSubscription: { type: Boolean, default: false },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
