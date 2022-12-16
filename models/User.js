const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({

    username: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        unique: true
    },

    displayname: {
        type: String,
        required: true,
    },

    joinDate: {
        type: Date,
        default: Date.now
    }
})
// Users is the collection where users data is going to be stored.

const User = mongoose.model('Users', UserSchema);
module.exports = User;