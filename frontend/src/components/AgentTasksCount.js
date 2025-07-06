



// import React, { useState } from 'react';
// import axios from 'axios';

// const AgentTasksCount = () => {
//   const [agentId, setAgentId] = useState('');
//   const [agentName, setAgentName] = useState('');
//   const [tasks, setTasks] = useState([]);       // Store tasks array here
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem('token');

//   const handleCheck = async () => {
//     if (!agentId.trim()) {
//       setError('Please enter a valid Agent ID');
//       setAgentName('');
//       setTasks([]);
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setAgentName('');
//     setTasks([]);

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/leads/${agentId}`,  // Assuming this returns agent + leads/tasks
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const { agent, leads } = response.data;

//       setAgentName(agent.name);
//       setTasks(leads);  // Save the tasks/leads array
//     } catch (err) {
//        console.error('Fetch agent tasks error:', err);
//   console.error('Response:', err.response);
//       setError(err.response?.data?.message || 'Failed to fetch agent tasks.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5" style={{ maxWidth: '600px' }}>
//       <div className="card p-4 shadow">
//         <h3 className="text-center mb-4">Check Agent Tasks</h3>

//         <input
//           type="text"
//           className="form-control mb-3"
//           placeholder="Enter Agent ID"
//           value={agentId}
//           onChange={(e) => setAgentId(e.target.value)}
//         />

//         <button
//           className="btn btn-primary w-100"
//           onClick={handleCheck}
//           disabled={loading}
//         >
//           {loading ? 'Loading...' : 'Get Tasks'}
//         </button>

//         {error && (
//           <div className="alert alert-danger mt-3" role="alert">
//             {error}
//           </div>
//         )}

//         {agentName && !error && (
//           <div className="alert alert-success mt-3">
//             <strong>Agent Name:</strong> {agentName} <br />
//             <strong>Total Tasks:</strong> {tasks.length}
//           </div>
//         )}

//         {tasks.length > 0 && (
//           <div className="mt-3">
//             <h5>Tasks List:</h5>
//             <ul className="list-group">
//               {tasks.map((task, idx) => (
//                 <li key={task._id || idx} className="list-group-item">
//                   <strong>{task.firstName}</strong> | {task.phone} | {task.notes}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AgentTasksCount;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AgentsTasksCount = () => {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leads/all-leads', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeads(res.data.leads);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load leads');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">All Leads with Assigned Agents</h3>

      {loading && <p className="text-center">Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && leads.length === 0 && (
        <p className="text-center">No leads available.</p>
      )}

      {leads.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Lead Name</th>
                <th>Phone</th>
                <th>Notes</th>
                <th>Agent Name</th>
                <th>Agent Email</th>
                <th>Agent Phone</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={lead._id}>
                  <td>{index + 1}</td>
                  <td>{lead.firstName}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.notes}</td>
                  <td>{lead.agent?.name || 'Unassigned'}</td>
                  <td>{lead.agent?.email || '-'}</td>
                  <td>{lead.agent?.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentsTasksCount;
