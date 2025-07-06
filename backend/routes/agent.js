// const express = require('express');
// const { addAgent, getAllAgents, getAgentTaskCount } = require('../controllers/agentController'); // Import new controller function
// const authenticateToken = require('../middleware/verifyToken');
// const router = express.Router();

// // Route to create a new agent (POST) - Protected with authentication
// router.post('/', authenticateToken, addAgent);

// // Route to get all agents (GET) - Optional authentication
// router.get('/', getAllAgents);

// // Route to get task count for a specific agent by ID (GET) - Protected with authentication (optional)
// router.get('/taskcount/:agentId', authenticateToken, getAgentTaskCount);

// module.exports = router;



const express = require('express');
const {
  addAgent,
  getAllAgents,
  getAgentTaskCount
} = require('../controllers/agentController');
const authenticateToken = require('../middleware/verifyToken');

const router = express.Router();

// Route to create a new agent (POST) - Protected
router.post('/', authenticateToken, addAgent);

// ✅ Route to get all agents (GET) - Should be protected too
router.get('/', authenticateToken, getAllAgents);

// Route to get task count for a specific agent by ID - Protected
router.get('/taskcount/:agentId', authenticateToken, getAgentTaskCount);

module.exports = router;
