const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    credits: {
        type: Number
    },
    faculty: {
        type: String
    },
    students: [{
        type: String
    }]
});

module.exports = mongoose.model('Course', courseSchema);

module.exports = mongoose.model('Course', courseSchema);