
const fs = require('fs');
const csv = require('csv-parser');
const Agent = require('../models/Agent');
const Lead = require('../models/Lead');

exports.distributeTasks = async (req, res) => {
  const { file } = req;
  const newTasks = [];

  if (!file) {
    console.error('No CSV file uploaded');
    return res.status(400).json({ message: 'CSV file is required' });
  }

  console.log(`Starting CSV parsing: ${file.path}`);

  // Parse CSV file
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (row) => {
      if (!row.FirstName || !row.Phone || !row.Notes) {
        console.warn('Skipping invalid row:', row);
        return;
      }
      newTasks.push({
        firstName: row.FirstName.trim(),
        phone: row.Phone.trim(),
        notes: row.Notes.trim(),
      });
    })
    .on('end', async () => {
      try {
        console.log(`CSV parsing completed. New tasks parsed: ${newTasks.length}`);

        // Fetch all agents
        const agents = await Agent.find();
        console.log(`Total agents fetched: ${agents.length}`);

        if (agents.length === 0) {
          fs.unlinkSync(file.path);
          console.error('No agents found in DB');
          return res.status(400).json({ message: 'No agents available' });
        }

        // Fetch existing leads assigned to agents
        const existingLeads = await Lead.find({
          agent: { $in: agents.map(a => a._id) }
        });

        console.log(`Existing leads fetched: ${existingLeads.length}`);

        // Map agentId -> existing tasks array
        const agentTasksMap = {};
        agents.forEach(agent => {
          agentTasksMap[agent._id.toString()] = [];
        });

        existingLeads.forEach(lead => {
          agentTasksMap[lead.agent.toString()].push({
            firstName: lead.firstName,
            phone: lead.phone,
            notes: lead.notes,
          });
        });

        // Log number of existing tasks per agent
        agents.forEach(agent => {
          const count = agentTasksMap[agent._id.toString()].length;
          console.log(`Agent ${agent._id} has ${count} existing tasks`);
        });

        // Combine existing + new tasks
        let allTasks = [];
        Object.values(agentTasksMap).forEach(tasksArr => {
          allTasks = allTasks.concat(tasksArr);
        });
        allTasks = allTasks.concat(newTasks);

        console.log(`Total tasks to distribute (existing + new): ${allTasks.length}`);

        // Redistribute tasks evenly
        const distributed = distributeTasksEqually(allTasks, agents);

        // Log distribution results
        distributed.forEach((group, idx) => {
          console.log(`Agent ${idx} (${group.agentId}) assigned tasks: ${group.tasks.length}`);
        });

        // Delete old leads assigned to agents
        await Lead.deleteMany({ agent: { $in: agents.map(a => a._id) } });
        console.log('Deleted old lead assignments for agents');

        // Prepare leads for insertion
        const leadsToSave = [];
        distributed.forEach(group => {
          group.tasks.forEach(task => {
            leadsToSave.push({
              ...task,
              agent: group.agentId,
            });
          });
        });

        await Lead.insertMany(leadsToSave);
        console.log(`Inserted ${leadsToSave.length} leads after redistribution`);

        // Delete uploaded CSV file
        fs.unlinkSync(file.path);
        console.log('Deleted uploaded CSV file');

        res.status(200).json({
          message: 'Tasks dynamically distributed and saved successfully',
          data: distributed,
        });
      } catch (error) {
        if (file && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        console.error('Error during task distribution:', error);
        res.status(500).json({ message: 'Error distributing tasks dynamically', error });
      }
    });
};

const distributeTasksEqually = (tasks, agents) => {
  const numAgents = agents.length;
  const totalTasks = tasks.length;
  const baseCount = Math.floor(totalTasks / numAgents);
  const remainder = totalTasks % numAgents;

  console.log(`Distributing tasks: Total tasks: ${totalTasks}, Agents: ${numAgents}`);
  console.log(`Base tasks per agent: ${baseCount}, Remaining tasks: ${remainder}`);

  const distributed = agents.map(agent => ({
    agentId: agent._id,
    tasks: [],
  }));

  let taskIndex = 0;

  // Assign baseCount tasks to each agent
  for (let i = 0; i < numAgents; i++) {
    for (let j = 0; j < baseCount; j++) {
      distributed[i].tasks.push(tasks[taskIndex]);
      taskIndex++;
    }
  }

  // Assign remainder tasks one by one
  for (let k = 0; k < remainder; k++) {
    distributed[k].tasks.push(tasks[taskIndex]);
    taskIndex++;
  }

  return distributed;
};
