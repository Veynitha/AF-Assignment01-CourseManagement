const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    faculty: {
        type: String
    },
    courses: [{
        type: String
    }]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;