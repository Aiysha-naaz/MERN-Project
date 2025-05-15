// src/components/ViewLeads.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewLeads({ agentId }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(`/api/leads/${agentId}`);
        setLeads(res.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [agentId]);

  if (loading) return <p>Loading leads...</p>;

  return (
    <div>
      <h2>Leads for Agent {agentId}</h2>
      {leads.length === 0 ? (
        <p>No leads found.</p>
      ) : (
        <ul>
          {leads.map((lead) => (
            <li key={lead._id}>
              <strong>Name:</strong> {lead.firstName} <br />
              <strong>Phone:</strong> {lead.phone} <br />
              <strong>Notes:</strong> {lead.notes}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewLeads;
