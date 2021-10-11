const yup = require('yup')

const resendEmailValidation = yup.object({
    email: yup.string().email().required()
})

module.exports = {
    resendEmailValidation
}
