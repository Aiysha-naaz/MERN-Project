
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import the controller

// @route POST /api/auth/login
router.post('/login', authController.login);

// Route for Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// Route for Resetting Password
router.post('/reset-password', authController.resetPassword);

module.exports = router;
