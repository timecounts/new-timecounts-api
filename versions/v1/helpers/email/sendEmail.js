const transporter = require('../email')
const verificationMail = require('./templates/verificationMail')

const verificationEmail = async (sender, receiver, receiverName, verificationLink) => {
    return await transporter.sendMail({
        from: `"Timecounts" <${sender}>`, // sender address
        to: receiver, // list of receivers
        subject: "Email Verification", // Subject line
        text: verificationMail(receiverName, verificationLink).text, // plain text body
        html: verificationMail(receiverName, verificationLink).html, // html body
    })
}

module.exports = { verificationEmail }
