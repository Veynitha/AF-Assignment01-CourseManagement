const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    location: {
        type: String
    }
});

module.exports = mongoose.model('Resource', resourceSchema);