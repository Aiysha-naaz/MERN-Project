

// src/components/AddAgent.js
import { useState } from 'react';
import styles from '../styles/AddAgent.module.css';
import API from '../api';

function AddAgent() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Please log in first.');
      return;
    }

    try {
      await API.post('/agents', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Agent added successfully!');
      setForm({ name: '', email: '', phone: '', password: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Add New Agent</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Agent Name"
          required
          className={styles.input}
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Agent Email"
          required
          className={styles.input}
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Mobile (+91XXXXXXXXXX)"
          required
          className={styles.input}
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Add Agent
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default AddAgent;

