const mongoose = require('mongoose')

// * Initialize Database
mongoose
    .connect(process.env.MONGODB_URI, {
        ssl: true,
        sslValidate: true,
        noDelay: true
    })
    .then(() => {
        console.log('Mongodb connected!')
    })
    .catch(error => {
        console.log(`Mongoose Connection Error: ${error.message}`)
    })

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to database.')
})

mongoose.connection.on('error', error => {
    console.log(`MongoDB Error: ${error.message}`)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose connection is disconnected due to app termination.')
        process.exit(0)
    })
})