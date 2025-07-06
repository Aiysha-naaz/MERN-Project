// // routes/leadRoutes.js
// const express = require('express');
// const { getLeadsByAgent } = require('../controllers/leadController');
// const leadController = require('../controllers/leadController');


// const router = express.Router();

// // Fetch leads assigned to a specific agent
// router.get('/:agentId', getLeadsByAgent); // Ensure the parameter is properly set up
// router.get('/all-leads', leadController.getAllLeadsWithAgents);  // new

// module.exports = router;

// const express = require('express');
// const leadController = require('../controllers/leadController');

// const router = express.Router();

// // ✅ First: Specific route must come first
// router.get('/all-leads', leadController.getAllLeadsWithAgents);

// // ✅ Then: Dynamic route should come after
// router.get('/:agentId', leadController.getLeadsByAgent);

// module.exports = router;

const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const authenticateToken = require('../middleware/verifyToken'); // path may vary

// Protect this route to get only current admin's leads
router.get('/all-leads', authenticateToken, leadController.getAllLeadsWithAgents);

// Optional: If you want to protect agent-wise route too
router.get('/:agentId', authenticateToken, leadController.getLeadsByAgent);

module.exports = router;

