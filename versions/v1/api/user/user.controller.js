const User = require("./user.model")
const validate = require("../../helpers/validation/validate")
const Validators = require('../../helpers/validation/userValidations')
const bcrypt = require("bcrypt")
const transporter = require('../../helpers/email')
const nodemailer = require('nodemailer')
const MyError = require("../../error/MyError")

exports.createUser = async (req, res, next) => {
    try {
        const bodyData = req.body

        const data = await validate(Validators.createUserValidation, bodyData)

        const user = await User.findOne({ email: data.email })

        if (user)
            throw new MyError(404, "User is already registered with this email.")

        const password = data.password
        data.password = bcrypt.hashSync(password, 10)

        await User.create(data)

        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <deepanshu@capitalnumbers.com>', // sender address
            to: "deepanshu@capitalnumbers.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        })

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
