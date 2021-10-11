const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
})

transporter.verify(function (error, success) {
    if (error) {
        console.log(error)
    } else {
        console.log("Email service is ready to serve emails.")
    }
})

module.exports = transporter