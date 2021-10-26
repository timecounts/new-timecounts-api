const yup = require('yup')

const createUserValidation = yup.object({
    fullName: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required(),
})

const updateUserValidation = yup.object({
    firstName: yup.string().required('First Name must contain a First Name'),
    lastName: yup.string().required('Last Name must contain a Last Name'),
    phoneNumber: yup.string(),
    dob: yup.date('Date of Birth must be a Date'),
    country: yup.string('Country must be valid string.'),
    address: yup.string('Address must be valid string.'),
    city: yup.string('City must be valid string.'),
    province: yup.string('State/Province must be a valid string.'),
    zip: yup.number('Zip/Postal Code must be a Number.')
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
    updateUserValidation,
    loginUserValidation,
    forgotPasswordValidation,
    resetPasswordValidation
}