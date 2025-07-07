


// const Agent = require('../models/Agent');
// const Lead = require('../models/Lead'); // Required for task count
// const bcrypt = require('bcryptjs');

// // Add a new agent
// exports.addAgent = async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   try {
//     // Check if the agent already exists
//     const agentExists = await Agent.findOne({ email });
//     if (agentExists) return res.status(400).json({ message: 'Agent already exists' });

//     const agent = new Agent({
//       name,
//       email,
//       phone,
//       password,
//       admin: req.user.id
//     });

//     await agent.save();
//     res.status(201).json({ message: 'Agent created successfully', agent });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get all agents
// exports.getAllAgents = async (req, res) => {
//   try {
//     const agents = await Agent.find();
//     res.status(200).json(agents);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// //  Get task count for a specific agent
// exports.getAgentTaskCount = async (req, res) => {
//   const { agentId } = req.params;

//   try {
//     const agent = await Agent.findById(agentId);
//     if (!agent) return res.status(404).json({ message: 'Agent not found' });

//     const taskCount = await Lead.countDocuments({ agent: agentId });

//     res.status(200).json({
//       agentId,
//       agentName: agent.name,
//       taskCount
//     });
//   } catch (error) {
//     console.error('Error getting task count:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };




const Agent = require('../models/Agent');
const Lead = require('../models/Lead');
const bcrypt = require('bcryptjs');

// -----------------------------
// Add a new agent (bound to admin)
// -----------------------------
exports.addAgent = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // ✅ Check if agent with same email already exists for this admin
    const agentExists = await Agent.findOne({ email, admin: req.user.id });
    if (agentExists) {
      return res.status(400).json({ message: 'Agent already exists under this admin' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = new Agent({
      name,
      email,
      phone,
      password,
      admin: req.user.id
    });

    await agent.save();
    res.status(201).json({ message: 'Agent created successfully', agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// -----------------------------
// Get all agents for logged-in admin only
// -----------------------------
// exports.getAllAgents = async (req, res) => {
//   try {
//     const agents = await Agent.find({ admin: req.user.id }); // Only return agents for this admin
//     res.status(200).json(agents);
//   } catch (error) {
//     console.error('Error fetching agents:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.getAllAgents = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.log("No admin ID found in req.user");
      return res.status(401).json({ message: 'Unauthorized. No admin ID found.' });
    }

    console.log("Admin ID:", req.user.id);

    const agents = await Agent.find({ admin: req.user.id });

    console.log("Agents found:", agents.length);
    res.status(200).json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Server error fetching agents' });
  }
};



// -----------------------------
// Get task count for a specific agent
// -----------------------------
exports.getAgentTaskCount = async (req, res) => {
  const { agentId } = req.params;

  try {
    const agent = await Agent.findById(agentId);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    // Optional: check if agent belongs to logged-in admin
    if (agent.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const taskCount = await Lead.countDocuments({ agent: agentId });

    res.status(200).json({
      agentId,
      agentName: agent.name,
      taskCount
    });
  } catch (error) {
    console.error('Error getting task count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
