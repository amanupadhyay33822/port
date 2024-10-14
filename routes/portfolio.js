const express = require("express")
const { createPortfolio, getAllPortfolioItems, getPortfolioById, updatePortfolio, deletePortfolio } = require("../controllers/portfolio")
const router = express.Router()

// Create a new portfolio entry
router.post('/create', createPortfolio);

// Get all portfolio entries
router.get('/get', getAllPortfolioItems);

// Get a portfolio entry by ID
router.get('/get/:id', getPortfolioById);

// Update a portfolio entry by ID
router.put('/update/:id',updatePortfolio);

// Delete a portfolio entry by ID
router.delete('/del/:id', deletePortfolio);


module.exports = router