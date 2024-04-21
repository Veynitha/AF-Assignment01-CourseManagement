const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
    faculty: {
        type: String,
        required: true
    },
    sessions: [{
        type: String,
        required: true     
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;