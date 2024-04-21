const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    resources: {
        type: [String],
        default: []
    },
    allocations: [{
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        course: {
            type: String,
            required: true
        }
    }]
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;