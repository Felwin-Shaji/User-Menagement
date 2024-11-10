const mongoose = require('mongoose');

// Define a schema for User
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true
     },
    email: {
         type: String,
        required: true
     },
    password: { 
        type: String, 
        required: true 
    }
});

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
