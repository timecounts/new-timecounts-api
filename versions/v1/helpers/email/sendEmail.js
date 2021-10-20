const transporter = require('../email')
const userVerificationMail = require('./templates/verificationMail')
const organizationApprovalMail = require('./templates/organizationApprovalMail')

const verificationEmail = async (sender, receiver, receiverName, verificationLink) => {
    return await transporter.sendMail({
        from: `"Timecounts" <${sender}>`, // sender address
        to: receiver, // list of receivers
        subject: "Email Verification", // Subject line
        text: userVerificationMail(receiverName, verificationLink).text, // plain text body
        html: userVerificationMail(receiverName, verificationLink).html, // html body
    })
}

const verificationOrganizationEmail = async (sender, receiver, receiverName, verificationLink) => {
    return await transporter.sendMail({
        from: `"Timecounts" <${sender}>`,
        to: receiver,
        subject: 'Organization Approval',
        text: organizationApprovalMail(receiverName, verificationLink).text,
        html: organizationApprovalMail(receiverName, verificationLink).html,
    })
}

module.exports = { 
    verificationEmail ,
    verificationOrganizationEmail
}
