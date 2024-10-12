const express = require('express');
const router = express.Router();
const { createTattoo, getAllTattoos, getTattooById, updateTattoo, deleteTattoo } = require("../controllers/tattoo")

// Create a new tattoo
router.post('/create', createTattoo);

// Get all tattoos
router.get('/get', getAllTattoos);

// Get a tattoo by ID
router.get('/get/:id', getTattooById);

// Update a tattoo by ID
router.put('/update/:id', updateTattoo);

// Delete a tattoo by ID
router.delete('/del/:id', deleteTattoo);

module.exports = router;