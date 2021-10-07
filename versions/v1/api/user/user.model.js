const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    facebookId: {
        type: String,
        len: 15,
        unique: true
    },
    googleId: {
        type: String,
        len: 21,
        unique: true
    },
    fullName: {
        type: String, 
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('User', userSchema)