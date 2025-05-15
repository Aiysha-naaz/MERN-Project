

// src/components/Dashboard.js
import { Link } from 'react-router-dom';
import styles from '../styles/Dashboard.module.css';

function Dashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Admin Dashboard</h1>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>Add Agent</h5>
            <p className={styles.cardText}>Create a new agent profile with contact and login details.</p>
            <Link to="/add-agent" className={styles.cardButton}> Add Agent</Link>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>Upload File</h5>
            <p className={styles.cardText}>Upload a file and distribute leads to agents.</p>
            <Link to="/upload" className={styles.cardButton}>Upload File</Link>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>View All Agents</h5>
            <p className={styles.cardText}>Browse all registered agents and their distributed leads.</p>
            <Link to="/all-agent-leads" className={styles.cardButton}>View Agents</Link>
          </div>
        </div>


         <div className={styles.card}>
  <div className={styles.cardBody}>
    <h5 className={styles.cardTitle}>Task Distribution</h5>
    <p className={styles.cardText}>See how tasks are distributed among thes agents.</p>
    <Link to="/task-distribution" className={styles.cardButton}>View Distribution</Link>
  </div>
</div>


        <div className={styles.card}>
          <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>Search Leads by Agent ID</h5>
            <p className={styles.cardText}>Find leads for a specific agent using their ID.</p>
            <Link to="/leads/:agentId" className={styles.cardButton}>View Leads</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
