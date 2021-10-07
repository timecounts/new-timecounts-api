require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const passport = require('passport')
const compression = require('compression')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression({
    level: 9,
    threshold: 10 * 1000,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false
        }
        return compression.filter(req, res)
    }
}))
app.use(passport.initialize())

app.get('/', (req, res) => {
    res.send('OK')
})

const v1 = require('./versions/v1/routes')
app.use('/api/v1', v1)

// * 404 Route
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found.'
    })
})

// * Error Handler
const errorHandler = require('./versions/v1/error/handleError')
app.use(errorHandler)

module.exports = app