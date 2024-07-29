import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="logo">Lecture Tracker</h1>
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Homepage</Link></li>
          <li><Link to="/report">Attendance Report</Link></li>
          <li><Link to="/statistics">Statistics</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
