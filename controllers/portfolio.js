const Portfolio = require("../models/Portfolio");

// Create a new portfolio item
exports.createPortfolio = async (req, res) => {
  try {
    const { imgUrl, title, type } = req.body;

    // Manual validation
    if (!imgUrl || !title || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const portfolio = new Portfolio({ imgUrl, title, type });
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Get all portfolio items
exports.getAllPortfolioItems = async (req, res) => {
  try {
    const portfolio = await Portfolio.find();
    res.status(200).send(portfolio);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Get a single portfolio item by ID
exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Update a portfolio item
exports.updatePortfolio = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { imgUrl: req.body.imgUrl, title: req.body.title, type: req.body.type },
      { new: true } // Returns the updated document
    );
    if (!portfolioItem) return res.status(404).send("Portfolio item not found");
    res.status(200).send(portfolioItem);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Delete a portfolio item
exports.deletePortfolio = async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolioItem) return res.status(404).send("Portfolio item not found");
    res.status(200).send("Portfolio item deleted");
  } catch (err) {
    res.status(400).send(err.message);
  }
};
