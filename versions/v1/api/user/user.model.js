const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    provider: {
        type: String
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
    }
})

module.exports = mongoose.model('User', userSchema)