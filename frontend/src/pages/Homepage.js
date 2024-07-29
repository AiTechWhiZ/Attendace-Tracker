import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/Homepage.css';

function Homepage() {
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('attended');
  const [formHidden, setFormHidden] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Predefined subjects
  const subjects = ['AI', 'SAIDS', 'WDM', 'WD', 'BCE', 'CC'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/attendance', { date, subject, status });
      setSuccessMessage('Attendance recorded successfully!');
      setFormHidden(true);
      setTimeout(() => {
        setDate('');
        setSubject('');
        setStatus('attended');
        setFormHidden(false);
        setSuccessMessage('');
      }, 2000); // Duration to show the success message before resetting
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="homepage">
        <form onSubmit={handleSubmit} className={`attendance-form ${formHidden ? 'hidden' : ''}`}>
          <h2>Attendance Form</h2>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <label>Subject:</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
            <option value="" disabled>Select a subject</option>
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="attended">Attended</option>
            <option value="missed">Missed</option>
          </select>
          <button type="submit">Submit</button>
        </form>
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </>
  );
}

export default Homepage;
