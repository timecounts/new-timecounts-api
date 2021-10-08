const TokenHandler = require('../../helpers/jsonwebtoken')
const User = require('../user/user.model')
const validate = require("../../helpers/validation/validate")
const Validators = require('../../helpers/validation/userValidations')
const bcrypt = require("bcrypt")
const MyError = require("../../error/MyError")
const redis = require('../../helpers/redis')

exports.login = async (req, res, next) => {
    try {
        const data = await validate(Validators.loginUserValidation, req.body)

        const user = await User.findOne({ email: data.email })
        if (user === null) throw new MyError(404, 'User does not exist.')

        const match = bcrypt.compareSync(data.password, user.password)
        if (!match) throw new MyError(403, 'User credentials do not match.')

        const accessToken = await TokenHandler.generateToken({ id: user._id })
        const refreshToken = await TokenHandler.signRefreshToken(user._id.toString())

        if (!refreshToken) throw new MyError(500, 'Internal Server Error')

        res.json({
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    } catch (error) {
        next(error)
    }
}

exports.failedLogin = (req, res, next) => {
    try {
        res.json({
            success: false,
            message: 'Login failed.'
        })
    } catch (error) {
        next(error)
    }
}

exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw new MyError(400, 'Bad Request')

        const userId = await TokenHandler.validateRefreshToken(refreshToken)
        if (!userId) throw new MyError(500, 'Internal Server Error')
        if (userId === 'unauthorized') throw new MyError(401, 'Unauthorized')

        redis.del(userId, (error, value) => {
            if (error) throw new MyError(500, 'Internal Server Error')
            res.sendStatus(204)
        })
    } catch (error) {
        next(error)
    }
}

exports.facebookLogin = async (req, res, next) => {
    try {
        console.log(req.body)
        const user = await User.findOne({ email: req.body._profile.email })
        if (user === null) throw new MyError(404, 'User does not exist.')

        const accessToken = await TokenHandler.generateToken({ id: user._id })
        const refreshToken = await TokenHandler.signRefreshToken(user._id.toString())

        if (!refreshToken) throw new MyError(500, 'Internal Server Error')

        res.json({
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    } catch (error) {
        next(error)
    }
}

exports.googleLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body._profile.email })
        if (user === null) throw new MyError(404, 'User does not exist.')

        const accessToken = await TokenHandler.generateToken({ id: user._id })
        const refreshToken = await TokenHandler.signRefreshToken(user._id.toString())

        if (!refreshToken) throw new MyError(500, 'Internal Server Error')

        res.json({
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    } catch (error) {
        next(error)
    }
}

exports.facebookSignup = async (req, res, next) => {
    try {

        console.log(req.body)
        const newUser = {
            fullName: req.body._profile.name,
            email: req.body._profile.email
        }

        let user = await User.findOne({ email: newUser.email })
        if (user) {
            const accessToken = await TokenHandler.generateToken({ id: user._id })
            const refreshToken = await TokenHandler.signRefreshToken(user._id.toString())

            if (!refreshToken) throw new MyError(500, 'Internal Server Error')

            res.json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        } else {
            user = await User.create(newUser)

            const accessToken = await TokenHandler.generateToken({ id: user._id })
            const refreshToken = await TokenHandler.signRefreshToken(user._id.toString())

            if (!refreshToken) throw new MyError(500, 'Internal Server Error')

            res.json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        }
    } catch (error) {
        next(error)
    }
}

exports.googleSignup = async (req, res, next) => {
    try {
        const newUser = {
            fullName: req.body._profile.name,
            email: req.body._profile.email
        }

        let user = await User.findOne({ email: newUser.email })
        if (user) {
            const accessToken = await TokenHandler.generateToken({ id: user._id })
            const refreshToken = await TokenHandler.signRefreshToken(user._id.toString())

            if (!refreshToken) throw new MyError(500, 'Internal Server Error')

            res.json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        } else {
            user = await User.create(newUser)

            const accessToken = await TokenHandler.generateToken({ id: user._id })
            const refreshToken = await TokenHandler.signRefreshToken(user._id.toString())

            if (!refreshToken) throw new MyError(500, 'Internal Server Error')

            res.json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        }
    } catch (error) {
        next(error)
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) throw new MyError(400, 'No refresh token found.')

        const userId = await TokenHandler.validateRefreshToken(refreshToken)
        if (!userId) throw new MyError(500, 'Internal Server Error')
        if (userId === 'unauthorized') throw new MyError(401, 'Unauthorized')

        const accessToken = await TokenHandler.generateToken({ id: userId })
        const newRefreshToken = await TokenHandler.signRefreshToken(userId)

        if (!newRefreshToken) throw new MyError(500, 'Internal Server Error')

        res.json({
            success: true,
            accessToken: accessToken,
            refreshToken: newRefreshToken
        })
    } catch (error) {
        next(error)
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const data = await validate(Validators.forgotPasswordValidation, req.body)

        const user = await User.findOne({ email: data.email })
        if (user === null) throw new MyError(404, 'Email does not exist.')

        const token = TokenHandler.forgotPasswordToken(user)
        console.log('Token ', token)

        const link = `http://localhost:5000/api/v1/auth/reset-password/${user._id}/${token}`
        console.log('Link ', link)

        // TODO: Send email to client (Transactional email)
        res.json({
            success: true,
            token: token,
            link: link
        })
    } catch (error) {
        next(error)
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const data = await validate(Validators.resetPasswordValidation, req.body)

        if (data.password !== data.confirmPassword) throw new MyError(400, 'Passwords do not match.')

        const password = bcrypt.hashSync(data.password, 10)
        const user = await User.findByIdAndUpdate(req.user, { password: password })
        res.json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error)
    }
}