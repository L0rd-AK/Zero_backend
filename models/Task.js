const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date }, // Optional, set when task is completed
  estimated_duration: { type: Number }, // In minutes, optional
});

module.exports = mongoose.model('Task', taskSchema);