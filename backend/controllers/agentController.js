


const Agent = require('../models/Agent');
const Lead = require('../models/Lead'); // Required for task count
const bcrypt = require('bcryptjs');

// Add a new agent
exports.addAgent = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if the agent already exists
    const agentExists = await Agent.findOne({ email });
    if (agentExists) return res.status(400).json({ message: 'Agent already exists' });

    const agent = new Agent({
      name,
      email,
      phone,
      password
    });

    await agent.save();
    res.status(201).json({ message: 'Agent created successfully', agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//  Get task count for a specific agent
exports.getAgentTaskCount = async (req, res) => {
  const { agentId } = req.params;

  try {
    const agent = await Agent.findById(agentId);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

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
