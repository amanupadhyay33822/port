const mongoose = require('mongoose');

const tattooSchema = new mongoose.Schema({
  imgUrl: {
    type: String,   // URL to the tattoo image
    required: true,
  },
  title: {
    type: String,   // Title of the tattoo
    required: true,
  },
  dateCreated: {
    type: Date,     // Date when the tattoo was created
    default: Date.now,  // Default to current date if not provided
  }
});

const Tattoo = mongoose.model('Tattoo', tattooSchema);

module.exports = Tattoo;
