const User = require('../user/user.model')
const Organization = require('./organization.model')
const validate = require('../../helpers/validation/validate')
const Validators = require('../../helpers/validation')
const MyError = require('../../error/MyError')
const { verificationOrganizationEmail } = require('../../helpers/email/sendEmail')
const TokenHandler = require('../../helpers/jsonwebtoken')

exports.createOrganization = async (req, res, next) => {
    try {
        const user = await User.findById(req.user)
        
        const bodyData = req.body

        const data = await validate(Validators.organization.addOrganizationValidation, bodyData)

        const organization = await Organization.findOne({ organizationName: data.organizationName })
        if (organization) throw new MyError(400, 'Organization already exists.')

        const newOrganization = await Organization.create(data)

        const token = await TokenHandler.organizationApprovalToken(newOrganization._id)
        const verificationLink = `${process.env.BACKEND_DOMAIN}/api/v1/organization/verify-organization/${token}`
        console.log('Organization verification link: ', verificationLink)

        const info = await verificationOrganizationEmail('deepanshu@capitalnumbers.com', user.email, user.fullName, '#')

        res.json({
            success: true,
            data: 'Organization added Successfully.'
        })
    } catch (error) {
        next(error)
    }
}

exports.organizationUrlExist = async (req, res, next) => {
    try {
        const bodyData = req.body

        const data = await validate(Validators.organization.organizationUrlExistValidation, bodyData)

        const org = await Organization.findOne({ publicUrl: data.publicUrl })
        if (org !== null) throw new MyError(400, `Organization with ${data.publicUrl} already exists.`)

        res.json({
            success: true,
            data: 'Public Url is available to use.'
        })
    } catch (error) {
        next(error)
    }
}

exports.verifyOrganization = async (req, res, next) => {
    try {
        const token = req.params.token
        
        const id = TokenHandler.validateOrganizationApprovalToken(token).id
        
        const organization = Organization.findById(id)
        if (!organization) throw new MyError(404, 'Organization is not registered.')

        await Organization.findByIdAndUpdate(id, { approved: true })

        res.send('OK')
        // res.redirect(`${process.env.FRONTEND_DOMAIN}/organization-approved/${organization.organizationName}`)
    } catch (error) {
        next(error)
    }
}
