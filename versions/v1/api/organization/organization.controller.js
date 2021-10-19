const Organization = require('./organization.model')
const validate = require('../../helpers/validation/validate')
const Validators = require('../../helpers/validation')
const MyError = require('../../error/MyError')

exports.createOrganization = async (req, res, next) => {
    try {
        const bodyData = req.body

        const data = await validate(Validators.organization.addOrganizationValidation, bodyData)

        const organization = await Organization.findOne({ organizationName: data.organizationName })
        if (organization) throw new MyError(400, 'Organization already exists.')

        await Organization.create(data)

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