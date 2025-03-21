const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const { ObjectId } = require('mongodb');
// Get all tasks for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  const { status } = req.query;
  let query = { user: req.userId };
  if (status) {
    query.status = status;
  }
  try {
    const tasks = await Task.find(query);
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
  const { name, estimated_duration } = req.body;
  if (!name) return res.status(400).json({ message: 'Task name is required' });

  try {
    const task = new Task({
      user: req.userId,
      name,
      start_time: new Date(), // Set to current time
      estimated_duration,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task (mark as completed)
// Update a task (mark as completed)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;  // Extract status from request body
  
  try {
    const task = await Task.findOne({ _id: new ObjectId(id) });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Update status if provided
    if (status) {
      task.status = status;
    }
    
    // If marking as completed and end_time is not set
    if (status === 'completed' && !task.end_time) {
      task.end_time = new Date();
    }
    
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// DELETE a task by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the task only if it belongs to the authenticated user
    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;