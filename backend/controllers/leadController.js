// const Agent = require('../models/Agent');
// const Lead = require('../models/Lead');

// exports.getLeadsByAgent = async (req, res) => {
//   const { agentId } = req.params;

//   try {
//     const agent = await Agent.findById(agentId);
//     if (!agent) {
//       return res.status(404).json({ message: 'Agent not found' });
//     }

//     console.log('Looking for leads with agent ID:', agentId);

//     // Correct field name here
//     const leads = await Lead.find({ agent: agentId });

//     console.log('Leads found:', leads);

//     if (leads.length === 0) {
//       return res.status(404).json({ message: 'No leads found for this agent' });
//     }

//     res.status(200).json({
//       agent: {
//         id: agent._id,
//         name: agent.name,
//         email: agent.email
//       },
//       leads
//     });
//   } catch (error) {
//     console.error('Error fetching leads:', error);
//     res.status(500).json({ message: 'Server error fetching leads' });
//   }
// };



// exports.getAllLeadsWithAgents = async (req, res) => {
//   try {
//     const leads = await Lead.find().populate('agent', 'name email phone');
//     res.status(200).json({ leads });
//   } catch (error) {
//     console.error('Error fetching leads with agents:', error);
//     res.status(500).json({ message: 'Server error fetching leads' });
//   }
// };




const Agent = require('../models/Agent');
const Lead = require('../models/Lead');

// // ✅ Get leads for a specific agent
// exports.getLeadsByAgent = async (req, res) => {
//   const { agentId } = req.params;

//   try {
//     const agent = await Agent.findById(agentId);
//     if (!agent) return res.status(404).json({ message: 'Agent not found' });

//     const leads = await Lead.find({ agent: agentId });

//     if (leads.length === 0) {
//       return res.status(404).json({ message: 'No leads found for this agent' });
//     }

//     res.status(200).json({
//       agent: {
//         id: agent._id,
//         name: agent.name,
//         email: agent.email
//       },
//       leads
//     });
//   } catch (error) {
//     console.error('Error fetching leads:', error);
//     res.status(500).json({ message: 'Server error fetching leads' });
//   }
// };






// // / ✅ Get leads for a specific agent
// exports.getLeadsByAgent = async (req, res) => {
//   const { agentId } = req.params;

//   try {
//     const agent = await Agent.findById(agentId);
//     console.log('🐞 agentId:', agentId);

//     if (!agent) return res.status(404).json({ message: 'Agent not found' });

//     const leads = await Lead.find({ agent: agentId });

//     if (leads.length === 0) {
//       return res.status(404).json({ message: 'No leads found for this agent' });
//     }

//     res.status(200).json({
//       agent: {
//         id: agent._id,
//         name: agent.name,
//         email: agent.email
//       },
//       leads
//     });
//   } catch (error) {
//     console.error('Error fetching leads:', error);
//     res.status(500).json({ message: 'Server error fetching leads' });
//   }
// };



exports.getLeadsByAgent = async (req, res) => {
  const { agentId } = req.params;

  try {
    const agent = await Agent.findOne({ _id: agentId, admin: req.user.id });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found or does not belong to you.' });
    }

    const leads = await Lead.find({
      agent: agentId,
      admin: req.user.id  // ✅ ownership enforced
    });

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


// // ✅ Get all leads with their assigned agents (for current admin if needed)
// exports.getAllLeadsWithAgents = async (req, res) => {
//   try {
//     const leads = await Lead.find().populate('agent', 'name email phone');
//     res.status(200).json({ leads });
//   } catch (error) {
//     console.error('Error fetching leads with agents:', error);
//     res.status(500).json({ message: 'Server error fetching leads' });
//   }
// };

exports.getAllLeadsWithAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ admin: req.user.id }).select('_id');
    const agentIds = agents.map(agent => agent._id);

    const leads = await Lead.find({ agent: { $in: agentIds } })
      .populate('agent', 'name email phone');

    res.status(200).json({ leads });
  } catch (error) {
    console.error('Error fetching leads with agents:', error);
    res.status(500).json({ message: 'Server error fetching leads' });
  }
};
