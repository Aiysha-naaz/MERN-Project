

// src/components/AgentLeads.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function AgentLeads() {
  const { agentId: paramId } = useParams();
  const [agentId, setAgentId] = useState(paramId || '');
  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // // Fetch whenever agentId changes
  // useEffect(() => {
  //   if (!agentId) return;
  //   setLoading(true);
  //   setError('');
  //   setLeads([]);

  //   axios.get(`http://localhost:5000/api/leads/${agentId}`)
  //     .then(res => {
  //       const list = res.data.leads || [];
  //       if (!list.length) setError('No leads found for this agent.');
  //       setLeads(list);
  //     })
  //     .catch(() => setError('Error fetching leads.'))
  //     .finally(() => setLoading(false));
  // }, [agentId]);

  console.log('🐞 paramId:', paramId);
console.log('🐞 agentId state:', agentId);

useEffect(() => {
  if (!agentId) return;

  setLoading(true);
  setError('');
  setLeads([]);

  const token = localStorage.getItem('token'); // ✅

  axios
    .get(`http://localhost:5000/api/leads/${agentId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ must match backend!
      },
    })
    .then(res => {
      const list = res.data.leads || [];
      if (!list.length) setError('No leads found for this agent.');
      setLeads(list);
    })
    .catch(err => {
      console.error('➡️ Leads API error:', err);
      setError('Error fetching leads.');
    })
    .finally(() => setLoading(false));
}, [agentId]);

  // const handleSearch = () => {
  //   if (!agentId.trim()) {
  //     setError('Please enter a valid Agent ID');
  //     setLeads([]);
  //     return;
  //   }
  //   // triggers useEffect
  // };

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id.trim());

const handleSearch = () => {
  if (!agentId.trim()) {
    setError('Please enter an Agent ID');
    setLeads([]);
    return;
  }

  if (!isValidObjectId(agentId)) {
    setError('❌ Invalid Agent ID format (must be 24 hex characters)');
    setLeads([]);
    return;
  }

  // ✅ Good ID → triggers useEffect automatically
  setError('');
};


  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <Link to="/all-agent-leads" style={{ marginBottom: '1rem', display: 'block' }}>
          &larr; Back to Agents List
        </Link>

        <h3 style={{ textAlign: 'center' }}>Agent Leads</h3>

        {/* Search box */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={agentId}
            onChange={e => setAgentId(e.target.value)}
            placeholder="Enter Agent ID"
            style={styles.input}
          />
          <button onClick={handleSearch} style={styles.button}>
            Search
          </button>
        </div>

        {/* Feedback */}
        {loading && <p style={{ textAlign: 'center' }}>Loading leads...</p>}
        {error   && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Leads list */}
        {leads.map(lead => (
          <div key={lead._id} style={styles.leadCard}>
            <p><strong>Name:</strong> {lead.firstName}</p>
            <p><strong>Phone:</strong> {lead.phone}</p>
            <p><strong>Notes:</strong> {lead.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
    background: '#f4f4f4',
    minHeight: '100vh',
  },
  formContainer: {
    width: '100%',
    maxWidth: '600px',
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  inputContainer: {
    display: 'flex',
    gap: '0.5rem',
    margin: '1rem 0',
  },
  input: {
    flex: 1,
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.5rem 1rem',
    background: '#2575fc',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  leadCard: {
    background: '#fafafa',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    marginBottom: '1rem',
  },
};

export default AgentLeads;
