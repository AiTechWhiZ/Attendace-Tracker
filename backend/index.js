const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/lecture-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const AttendanceSchema = new mongoose.Schema({
  date: String,
  subject: String,
  status: String, // 'attended' or 'missed'
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

// API Routes
app.post('/api/attendance', async (req, res) => {
  const { date, subject, status } = req.body;
  const newAttendance = new Attendance({ date, subject, status });
  await newAttendance.save();
  res.send(newAttendance);
});

app.get('/api/attendance', async (req, res) => {
  const attendances = await Attendance.find();
  res.send(attendances);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
