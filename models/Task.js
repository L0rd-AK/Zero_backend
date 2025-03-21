const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date },
  status: { type: String, enum: ['on-going', 'completed', 'deleted'], default: 'on-going' },
});

module.exports = mongoose.model('Task', taskSchema);