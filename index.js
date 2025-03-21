const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Allows frontend requests with more specific configuration
app.use(express.json()); // Parses JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Add a root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Zero Backend API' });
});

// Routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/tasks', taskRoutes); // Task management routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});