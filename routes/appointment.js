const express = require('express');
const { createAppointment, getallAppointments } = require('../controllers/Appointment'); // Adjust path as necessary
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.post('/create', verifyToken,createAppointment);
router.get('/get', verifyToken, getallAppointments);

module.exports = router;
