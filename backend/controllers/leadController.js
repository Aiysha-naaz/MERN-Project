const Agent = require('../models/Agent');
const Lead = require('../models/Lead');

exports.getLeadsByAgent = async (req, res) => {
  const { agentId } = req.params;

  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    console.log('Looking for leads with agent ID:', agentId);

    // Correct field name here
    const leads = await Lead.find({ agent: agentId });

    console.log('Leads found:', leads);

    if (leads.length === 0) {
      return res.status(404).json({ message: 'No leads found for this agent' });
    }

    res.status(200).json({
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email
      },
      leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Server error fetching leads' });
  }
};
