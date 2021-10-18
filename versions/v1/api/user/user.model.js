const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    provider: {
        type: String,
        enum: ['google', 'facebook']
    },
    providerId: {
        type: String
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
    },
    pictureUrl: {
        type: String
    },
    email_verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)