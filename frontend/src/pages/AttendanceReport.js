import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/AttendanceReport.css';

function AttendanceReport() {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState('date'); // Default filter type
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendance');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      let result = [...data];
      if (filterType === 'date' && startDate) {
        result = result.filter(entry => entry.date === startDate);
      } else if (filterType === 'week' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        result = result.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= start && entryDate <= end;
        });
      } else if (filterType === 'month' && month && year) {
        result = result.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getFullYear() === parseInt(year, 10) && (entryDate.getMonth() + 1) === parseInt(month, 10);
        });
      } else if (filterType === 'year' && year) {
        result = result.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getFullYear() === parseInt(year, 10);
        });
      }
      setFilteredData(result);
    };
    applyFilter();
  }, [data, filterType, startDate, endDate, month, year]);

  // Compute paginated data
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header />
      <div className="attendance-report">
        <h2>Attendance Report</h2>
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
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.subject}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default AttendanceReport;
