const yup = require('yup')

const createUserValidation = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required(),
})

const loginUserValidation = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required()
})

const forgotPasswordValidation = yup.object({
    email: yup.string().email().required()
})

const resetPasswordValidation = yup.object({
    password: yup.string().required(),
    confirmPassword: yup.string().required()
})

module.exports = {
    createUserValidation,
    loginUserValidation,
    forgotPasswordValidation,
    resetPasswordValidation
}