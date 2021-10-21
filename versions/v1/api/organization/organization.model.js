const mongoose = require('mongoose')

const organizationSchema = mongoose.Schema({
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        fullName: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        }
    },
    organizationName: {
        type: String,
        require: true,
        unique: true
    },
    publicUrl: {
        type: String,
        require: true,
        unique:  true
    },
    approved: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: [
            'nonprofit',
            'community group',
            'event/festival',
            'company',
            'vaccination site',
            'school',
            'government/civic',
            'own',
            'church/spiritual group'
        ]
    },
    areas: [{
        type: String,
        lowercase: true
    }],
    goals: [{
        type: String,
        enum: [
            'CREATE_REPORTS',
            'TRACK_VOLUNTEER_TIME',
            'MANAGE_A_VOLUNTEER_DATABASE',
            'CUSTOMIZE_SIGNUP_FORMS',
            'COMMUNICATION_WITH_VOLUNTEERS',
            'CREATE_VOLUNTEER_EVENTS',
            'PUBLISH_ONGOING_SCHEDULES',
            'CREATE_APPLICATIONS'
        ]
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Organization', organizationSchema)