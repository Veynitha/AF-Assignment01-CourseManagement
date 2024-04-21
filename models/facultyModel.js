const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
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
    courses: [{
        type: String
    }]
});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;