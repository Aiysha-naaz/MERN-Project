
// const fs = require('fs');
// const csv = require('csv-parser');
// const Agent = require('../models/Agent');
// const Lead = require('../models/Lead');

// exports.distributeTasks = async (req, res) => {
//   const { file } = req;
//   const newTasks = [];

//   if (!file) {
//     console.error('No CSV file uploaded');
//     return res.status(400).json({ message: 'CSV file is required' });
//   }

//   console.log(`Starting CSV parsing: ${file.path}`);

//   // Parse CSV file
//   fs.createReadStream(file.path)
//     .pipe(csv())
//     .on('data', (row) => {
//       if (!row.FirstName || !row.Phone || !row.Notes) {
//         console.warn('Skipping invalid row:', row);
//         return;
//       }
//       newTasks.push({
//         firstName: row.FirstName.trim(),
//         phone: row.Phone.trim(),
//         notes: row.Notes.trim(),
//       });
//     })
//     .on('end', async () => {
//       try {
//         console.log(`CSV parsing completed. New tasks parsed: ${newTasks.length}`);

//         // Fetch all agents
//         const agents = await Agent.find();
//         console.log(`Total agents fetched: ${agents.length}`);

//         if (agents.length === 0) {
//           fs.unlinkSync(file.path);
//           console.error('No agents found in DB');
//           return res.status(400).json({ message: 'No agents available' });
//         }

//         // Fetch existing leads assigned to agents
//         const existingLeads = await Lead.find({
//           agent: { $in: agents.map(a => a._id) }
//         });

//         console.log(`Existing leads fetched: ${existingLeads.length}`);

//         // Map agentId -> existing tasks array
//         const agentTasksMap = {};
//         agents.forEach(agent => {
//           agentTasksMap[agent._id.toString()] = [];
//         });

//         existingLeads.forEach(lead => {
//           agentTasksMap[lead.agent.toString()].push({
//             firstName: lead.firstName,
//             phone: lead.phone,
//             notes: lead.notes,
//           });
//         });

//         // Log number of existing tasks per agent
//         agents.forEach(agent => {
//           const count = agentTasksMap[agent._id.toString()].length;
//           console.log(`Agent ${agent._id} has ${count} existing tasks`);
//         });

//         // Combine existing + new tasks
//         let allTasks = [];
//         Object.values(agentTasksMap).forEach(tasksArr => {
//           allTasks = allTasks.concat(tasksArr);
//         });
//         allTasks = allTasks.concat(newTasks);

//         console.log(`Total tasks to distribute (existing + new): ${allTasks.length}`);

//         // Redistribute tasks evenly
//         const distributed = distributeTasksEqually(allTasks, agents);

//         // Log distribution results
//         distributed.forEach((group, idx) => {
//           console.log(`Agent ${idx} (${group.agentId}) assigned tasks: ${group.tasks.length}`);
//         });

//         // Delete old leads assigned to agents
//         await Lead.deleteMany({ agent: { $in: agents.map(a => a._id) } });
//         console.log('Deleted old lead assignments for agents');

//         // Prepare leads for insertion
//         const leadsToSave = [];
//         distributed.forEach(group => {
//           group.tasks.forEach(task => {
//             leadsToSave.push({
//               ...task,
//               agent: group.agentId,
//             });
//           });
//         });

//         await Lead.insertMany(leadsToSave);
//         console.log(`Inserted ${leadsToSave.length} leads after redistribution`);

//         // Delete uploaded CSV file
//         fs.unlinkSync(file.path);
//         console.log('Deleted uploaded CSV file');

//         res.status(200).json({
//           message: 'Tasks dynamically distributed and saved successfully',
//           data: distributed,
//         });
//       } catch (error) {
//         if (file && fs.existsSync(file.path)) {
//           fs.unlinkSync(file.path);
//         }
//         console.error('Error during task distribution:', error);
//         res.status(500).json({ message: 'Error distributing tasks dynamically', error });
//       }
//     });
// };

// const distributeTasksEqually = (tasks, agents) => {
//   const numAgents = agents.length;
//   const totalTasks = tasks.length;
//   const baseCount = Math.floor(totalTasks / numAgents);
//   const remainder = totalTasks % numAgents;

//   console.log(`Distributing tasks: Total tasks: ${totalTasks}, Agents: ${numAgents}`);
//   console.log(`Base tasks per agent: ${baseCount}, Remaining tasks: ${remainder}`);

//   const distributed = agents.map(agent => ({
//     agentId: agent._id,
//     tasks: [],
//   }));

//   let taskIndex = 0;

//   // Assign baseCount tasks to each agent
//   for (let i = 0; i < numAgents; i++) {
//     for (let j = 0; j < baseCount; j++) {
//       distributed[i].tasks.push(tasks[taskIndex]);
//       taskIndex++;
//     }
//   }

//   // Assign remainder tasks one by one
//   for (let k = 0; k < remainder; k++) {
//     distributed[k].tasks.push(tasks[taskIndex]);
//     taskIndex++;
//   }

//   return distributed;
// };
const fs = require('fs');
const csv = require('csv-parser');
const Agent = require('../models/Agent');
const Lead = require('../models/Lead');

exports.distributeTasks = async (req, res) => {
  console.log('🚀 distributeTasks called');
  console.log('📌 req.user:', req.user);
  console.log('📌 req.file:', req.file);
  const { file } = req;
  const newTasks = [];

  if (!file) return res.status(400).json({ message: 'CSV file is required' });

  fs.createReadStream(file.path)
    .pipe(csv())
    // .on('data', (row) => {
    //   if (!row.FirstName || !row.Phone || !row.Notes) return;
    //   newTasks.push({
    //     firstName: row.FirstName.trim(),
    //     phone: row.Phone.trim(),
    //     notes: row.Notes.trim(),
    //   });
    // })

   .on('data', (row) => {
  console.log('Row received:', row);

  const keys = Object.keys(row).reduce((acc, key) => {
    acc[key.toLowerCase().replace(/\s+/g, '')] = key;
    return acc;
  }, {});

  const firstName = row[keys['firstname']];
  const phone = row[keys['phone']];
  const notes = row[keys['notes']];

  if (!firstName || !phone || !notes) {
    console.log('Skipped invalid row:', row);
    return;
  }

  newTasks.push({
    firstName: firstName.trim(),
    phone: phone.trim(),
    notes: notes.trim(),
  });
})


    .on('end', async () => {
      try {
        console.log('req.user:', req.user);
console.log('req.file:', req.file);

        const agents = await Agent.find({ admin: req.user.id }); // only this admin's agents
        if (agents.length === 0) {
          fs.unlinkSync(file.path);
          return res.status(400).json({ message: 'No agents available' });
        }

        const existingLeads = await Lead.find({ agent: { $in: agents.map(a => a._id) } });

        const agentTasksMap = {};
        agents.forEach(agent => agentTasksMap[agent._id.toString()] = []);
        existingLeads.forEach(lead => {
          agentTasksMap[lead.agent.toString()].push({
            firstName: lead.firstName,
            phone: lead.phone,
            notes: lead.notes,
          });
        });

        let allTasks = [...newTasks];
        Object.values(agentTasksMap).forEach(arr => allTasks.push(...arr));

        const distributed = distributeTasksEqually(allTasks, agents);

        await Lead.deleteMany({ agent: { $in: agents.map(a => a._id) } });

        const leadsToSave = [];
        distributed.forEach(group => {
          group.tasks.forEach(task => {
            leadsToSave.push({
              ...task,
              agent: group.agentId,
              admin: req.user.id,
            });
          });
        });

        await Lead.insertMany(leadsToSave);
        fs.unlinkSync(file.path);

        res.status(200).json({
          message: 'Tasks distributed successfully',
          data: distributed
        });
      } catch (err) {
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        console.error('Distribution error:', err);
        res.status(500).json({ message: 'Error distributing tasks', error: err });
      }
    });
};

// const distributeTasksEqually = (tasks, agents) => {
//   const numAgents = agents.length;
//   const totalTasks = tasks.length;
//   const baseCount = Math.floor(totalTasks / numAgents);
//   const remainder = totalTasks % numAgents;

//   console.log(`Distributing ${totalTasks} tasks among ${numAgents} agents`);

//   const distributed = agents.map(agent => ({
//     agentId: agent._id,
//     tasks: [],
//   }));

//   let taskIndex = 0;

//   // Assign baseCount tasks to each agent
//   for (let i = 0; i < numAgents; i++) {
//     for (let j = 0; j < baseCount; j++) {
//       distributed[i].tasks.push(tasks[taskIndex]);
//       taskIndex++;
//     }
//   }

//   // Distribute remaining tasks starting from the first agent
//   for (let k = 0; k < remainder; k++) {
//     distributed[k].tasks.push(tasks[taskIndex]);
//     taskIndex++;
//   }

//   return distributed;
// };

const distributeTasksEqually = (tasks, agents) => {
  const numAgents = agents.length;
  const totalTasks = tasks.length;

  const baseCount = Math.floor(totalTasks / numAgents);
  const remainder = totalTasks % numAgents;

  console.log(`Distributing ${totalTasks} tasks among ${numAgents} agents`);
  console.log(`Each gets ${baseCount} base tasks, with ${remainder} remaining to distribute`);

  const distributed = agents.map(agent => ({
    agentId: agent._id,
    tasks: [],
  }));

  let taskIndex = 0;

  // Distribute baseCount tasks to each agent
  for (let i = 0; i < numAgents; i++) {
    for (let j = 0; j < baseCount; j++) {
      distributed[i].tasks.push(tasks[taskIndex]);
      taskIndex++;
    }
  }

  // Distribute remaining tasks one by one starting from the first agent
  for (let k = 0; k < remainder; k++) {
    distributed[k % numAgents].tasks.push(tasks[taskIndex]);
    taskIndex++;
  }

  return distributed;
};
