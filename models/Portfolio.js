const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  imgUrl: {
    type: String,   // URL to the portfolio image
    required: true,
  },
  title: {
    type: String,   // Title of the portfolio item
    required: true,
  },
  type: {
    type: String,   // Type of portfolio item (e.g., "Web Design", "Illustration", etc.)
    required: true,
  },
  dateCreated: {
    type: Date,     // Date when the portfolio item was created
    default: Date.now,  // Default to current date if not provided
  }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
