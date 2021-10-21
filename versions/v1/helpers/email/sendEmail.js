const transporter = require('../email')
const userVerificationMail = require('./templates/verificationMail')
const organizationRequestMail = require('./templates/organizationRequestMail')

const verificationEmail = async (sender, receiver, receiverName, verificationLink) => {
    return await transporter.sendMail({
        from: `"Timecounts" <${sender}>`, // sender address
        to: receiver, // list of receivers
        subject: "Email Verification", // Subject line
        text: userVerificationMail(receiverName, verificationLink).text, // plain text body
        html: userVerificationMail(receiverName, verificationLink).html, // html body
    })
}

const requestOrganizationEmail = async (receiver, receiverName, organizationName) => {
    return await transporter.sendMail({
        from: `"Timecounts" <amanda@timecounts.org, ankkit@timecounts.org>`,
        to: receiver,
        subject: 'Organization Approval',
        text: organizationRequestMail(receiverName, organizationName).text,
        html: organizationRequestMail(receiverName, organizationName).html,
    })
}

module.exports = { 
    verificationEmail ,
    requestOrganizationEmail
}
