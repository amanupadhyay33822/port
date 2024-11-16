const express = require('express');
const { createAppointment, getAllAppointments } = require('../controllers/Appointment'); // Adjust path as necessary
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.post('/create',createAppointment);
router.get('/get', verifyToken, getAllAppointments);

module.exports = router;
