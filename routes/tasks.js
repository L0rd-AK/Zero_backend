const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// Get all tasks for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
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
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.end_time = new Date(); // Set end time to current time
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