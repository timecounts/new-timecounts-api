const User = require("./user.model")
const validate = require("../../helpers/validation/validate")
const Validators = require('../../helpers/validation')
const bcrypt = require("bcrypt")
const MyError = require("../../error/MyError")
const { verificationEmail } = require('../../helpers/email/sendEmail')
const TokenHandler = require('../../helpers/jsonwebtoken')

exports.createUser = async (req, res, next) => {
    try {
        const bodyData = req.body

        const data = await validate(Validators.user.createUserValidation, bodyData)

        const user = await User.findOne({ email: data.email })

        if (user)
            throw new MyError(400, "User is already registered with this email.")

        const password = data.password
        data.password = bcrypt.hashSync(password, 10)

        const newUser = await User.create(data)

        const token = await TokenHandler.emailVerificationToken(newUser.email)
        const verificationLink = `${process.env.BACKEND_DOMAIN}/api/v1/auth/verify-email/${token}`
        console.log('Email verification link: ', verificationLink)

        const info = await verificationEmail('deepanshu@capitalnumbers.com', data.email, data.fullName, '#')

        res.json({
            success: true,
            data: "User created successfully.",
            mail: info
        })
    } catch (error) {
        next(error)
    }
}

exports.showAllUser = async (req, res, next) => {
    try {
        const userList = await User.find()

        res.json({
            success: true,
            data: userList
        })
    } catch (error) {
        next(error)
    }
}

exports.dashboard = (req, res) => {
    res.send('Dashboard')
}
