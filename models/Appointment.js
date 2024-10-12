const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    // unique: true, // Optional: to prevent duplicate email
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    enum: [
      'Mini (lettering or symbols)',
      'Japanese',
      'Blackwork',
      'Anime/Manga',
      'Black & Grey Realistic',
      'Color',
      'Micro/fine Line',
      'Others'
    ],
    required: true
  },
  residencyStatus: {
    type: String,
    enum: [
      'I am living in Korea indefinitely',
      'I am visiting or living in Korea temporarily'
    ],
    required: true
  },
  availableDays: {
    type: [String], // Array of strings to represent available days
    enum: ['Weekdays', 'Flexible', 'Weekends'],
    required: true
  },
  placement: {
    type: String,
  },
  sizeEstimate: {
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    }
  },
  color: {
    type: String, // Array of strings to represent available days
    enum: ['Color', 'No Color',],
  },
  designDescription: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
