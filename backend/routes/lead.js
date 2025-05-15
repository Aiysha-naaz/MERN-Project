// routes/leadRoutes.js
const express = require('express');
const { getLeadsByAgent } = require('../controllers/leadController');

const router = express.Router();

// Fetch leads assigned to a specific agent
router.get('/:agentId', getLeadsByAgent); // Ensure the parameter is properly set up

module.exports = router;
