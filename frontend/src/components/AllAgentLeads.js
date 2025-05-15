
// src/pages/AllAgentLeads.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AllAgentLeads() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/agents');
        setAgents(data);
      } catch {
        setError('Error fetching agents.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleViewLeads = (agentId) => {
    navigate(`/leads/${agentId}`);
  };

  if (loading) return <p className="text-center">Loading agents...</p>;
  if (error)   return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Agents List</h2>
      <table className="table table-bordered">
        <thead>
          <tr><th>Name</th><th>ID</th><th>Action</th></tr>
        </thead>
        <tbody>
          {agents.map(a => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a._id}</td>
              <td>
                <button
                  className="btn btn-info"
                  onClick={() => handleViewLeads(a._id)}
                >
                  View Leads
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllAgentLeads;
