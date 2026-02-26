require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Initialize App
const app = express();

// Middleware
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pep-mern-frontend.vercel.app"
  ],
  credentials: true
}));

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/assignments', require('./src/routes/assignmentRoutes'));
app.use('/api/reviews', require('./src/routes/reviewRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/instructor', require('./src/routes/instructorRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running successfully!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment loaded.');
});
