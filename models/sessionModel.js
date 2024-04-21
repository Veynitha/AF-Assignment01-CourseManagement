const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    stopTime: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    course: {
        type: String
    },
    type: {
        type: String,
        enum: ['course', 'event', 'other']
    }
});

const Session = mongoose.model('sessions', sessionSchema);

module.exports = Session;