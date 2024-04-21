const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User Schema
const userSchema = new Schema({
    email: { type: String,
         required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Faculty', 'Student'], required: true },
    refreshToken: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create User model
module.exports = mongoose.model('User', userSchema);
