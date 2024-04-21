const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  facultyId: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['all', 'faculty']
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
