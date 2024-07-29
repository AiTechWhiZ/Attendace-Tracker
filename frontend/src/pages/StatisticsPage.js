import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/StatisticsPage.css';

function StatisticsPage() {
  const [totalLectures, setTotalLectures] = useState(0);
  const [totalAttended, setTotalAttended] = useState(0);
  const [totalMissed, setTotalMissed] = useState(0);
  const [filterType, setFilterType] = useState('date'); // Default filter type
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        let url = 'http://localhost:5000/api/attendance';
        if (filterType === 'date' && startDate) {
          url += `?date=${startDate}`;
        } else if (filterType === 'week' && startDate && endDate) {
          url += `?start=${startDate}&end=${endDate}`;
        } else if (filterType === 'month' && month && year) {
          url += `?month=${month}&year=${year}`;
        } else if (filterType === 'year' && year) {
          url += `?year=${year}`;
        }
        const response = await axios.get(url);
        const data = response.data;
        setTotalLectures(data.length);
        setTotalAttended(data.filter(d => d.status === 'attended').length);
        setTotalMissed(data.filter(d => d.status === 'missed').length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchStatistics();
  }, [filterType, startDate, endDate, month, year]);

  return (
    <>
      <Header />
      <div className="statistics-page">
        <h2>Statistics</h2>
        <div className="filter-section">
          <label>Filter By:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="date">Date</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          {filterType === 'date' && (
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Select a date"
            />
          )}
          {filterType === 'week' && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
            </>
          )}
          {filterType === 'month' && (
            <>
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                ))}
              </select>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year"
                min="2000"
                max={new Date().getFullYear()}
              />
            </>
          )}
          {filterType === 'year' && (
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              min="2000"
              max={new Date().getFullYear()}
            />
          )}
        </div>
        <p>Total Lectures: {totalLectures}</p>
        <p>Total Attended Lectures: {totalAttended}</p>
        <p>Total Missed Lectures: {totalMissed}</p>
      </div>
    </>
  );
}

export default StatisticsPage;
