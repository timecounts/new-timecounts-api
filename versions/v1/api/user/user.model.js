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
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    dob: {
        type: Date,
    },
    country: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    province: {
        type: String,
    },
    zip: {
        type: Number,
    },
    profileImg: {
        type: Buffer,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)