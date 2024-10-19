const express = require('express');

const { createProposal, createContact } = require('../controllers/Contact');
const router = express.Router();

// Route to start a break
router.post('/submit',createContact);

// Route to end a break


module.exports = router;
