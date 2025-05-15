



import React, { useState } from 'react';
import axios from 'axios';

const AgentTasksCount = () => {
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [tasks, setTasks] = useState([]);       // Store tasks array here
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleCheck = async () => {
    if (!agentId.trim()) {
      setError('Please enter a valid Agent ID');
      setAgentName('');
      setTasks([]);
      return;
    }

    setLoading(true);
    setError('');
    setAgentName('');
    setTasks([]);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/leads/${agentId}`,  // Assuming this returns agent + leads/tasks
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { agent, leads } = response.data;

      setAgentName(agent.name);
      setTasks(leads);  // Save the tasks/leads array
    } catch (err) {
       console.error('Fetch agent tasks error:', err);
  console.error('Response:', err.response);
      setError(err.response?.data?.message || 'Failed to fetch agent tasks.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card p-4 shadow">
        <h3 className="text-center mb-4">Check Agent Tasks</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter Agent ID"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleCheck}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Tasks'}
        </button>

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {agentName && !error && (
          <div className="alert alert-success mt-3">
            <strong>Agent Name:</strong> {agentName} <br />
            <strong>Total Tasks:</strong> {tasks.length}
          </div>
        )}

        {tasks.length > 0 && (
          <div className="mt-3">
            <h5>Tasks List:</h5>
            <ul className="list-group">
              {tasks.map((task, idx) => (
                <li key={task._id || idx} className="list-group-item">
                  <strong>{task.firstName}</strong> | {task.phone} | {task.notes}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentTasksCount;
