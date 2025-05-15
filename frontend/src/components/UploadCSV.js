

// src/components/UploadCSV.js
import React, { useState } from 'react';
import styles from '../styles/UploadCSV.module.css';
import API from '../api';

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [distributedData, setDistributedData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    setDistributedData([]);

    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const token = localStorage.getItem('token');
      const response = await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('CSV uploaded and distributed successfully!');
      setDistributedData(response.data.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed.');
    }
  };
console.log('Distributed Data:', distributedData);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Upload File</h2>
      <form onSubmit={handleUpload} className={styles.form}>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <button type="submit" className={styles.button}>
          Upload
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}

      {distributedData.length > 0 && (
        <section className={styles.distributedLists}>
          <h3 className={styles.subHeader}>Task Distribution</h3>
          {distributedData.map(({ agentId, tasks }, index) => (
            <div key={agentId || index} className={styles.agentGroup}>
              <h4 className={styles.agentTitle}>Agent ID: {agentId}</h4>
              <ul className={styles.taskList}>
                {tasks.map((task, idx) => (
                  <li key={idx} className={styles.taskItem}>
                    <span className={styles.taskName}>{task.firstName}</span> |{' '}
                    <span className={styles.taskPhone}>{task.phone}</span> |{' '}
                    <span className={styles.taskNotes}>{task.notes}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default UploadCSV;
