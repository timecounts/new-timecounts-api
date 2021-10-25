const TokenHandler = require('../../helpers/jsonwebtoken')
const User = require('../user/user.model')
const validate = require("../../helpers/validation/validate")
const Validators = require('../../helpers/validation')
const bcrypt = require("bcrypt")
const MyError = require("../../error/MyError")
const redis = require('../../helpers/redis')
const { verificationEmail } = require('../../helpers/email/sendEmail')

exports.login = async (req, res, next) => {
    try {
        const data = await validate(Validators.user.loginUserValidation, req.body)

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
            refreshToken: refreshToken,
            userData: {
                username: user.fullName,
                email: user.email,
                pictureUrl: user.pictureUrl
            }
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
        const user = await User.findOne({ email: req.body._profile.email })
        if (user === null) throw new MyError(404, 'User does not exist.')

        const accessToken = await TokenHandler.generateToken({ id: user._id })
        const refreshToken = await TokenHandler.signRefreshToken(user._id.toString())

        if (!refreshToken) throw new MyError(500, 'Internal Server Error')

        res.json({
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            userData: {
                username: user.fullName,
                email: user.email
            }
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
            refreshToken: refreshToken,
            userData: {
                username: user.fullName,
                email: user.email
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.facebookSignup = async (req, res, next) => {
    try {
        const newUser = {
            provider: req.body._provider,
            providerId: req.body._profile.id,
            fullName: req.body._profile.name,
            email: req.body._profile.email,
            pictureUrl: req.body._profile.profilePicURL,
            email_verified: true
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
                refreshToken: refreshToken,
                userData: {
                    username: user.fullName,
                    email: user.email
                }
            })
        }
    } catch (error) {
        next(error)
    }
}

exports.googleSignup = async (req, res, next) => {
    try {
        const newUser = {
            provider: req.body._provider,
            providerId: req.body._profile.id,
            fullName: req.body._profile.name,
            email: req.body._profile.email,
            pictureUrl: req.body._profile.profilePicURL,
            email_verified: true
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
                refreshToken: refreshToken,
                userData: {
                    username: user.fullName,
                    email: user.email
                }
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

        redis.del(userId, (error, value) => {
            if (error) throw new MyError(500, 'Internal Server Error')
        })

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
        const data = await validate(Validators.user.forgotPasswordValidation, req.body)

        const user = await User.findOne({ email: data.email })
        if (user === null) throw new MyError(404, 'Email does not exist.')

        const token = TokenHandler.forgotPasswordToken(user)
        console.log('Token ', token)

        // const link = `${process.env.BACKEND_DOMAIN}/api/v1/auth/reset-password/${user._id}/${token}`
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
        const data = await validate(Validators.user.resetPasswordValidation, req.body)

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

exports.resendEmail = async (req, res, next) => {
    try {
        const bodyData = req.body

        const data = await validate(Validators.auth.resendEmailValidation, bodyData)

        const user = await User.findOne({ email: data.email })

        if (!user) throw new MyError(404, 'User is not registered.')

        const token = await TokenHandler.emailVerificationToken(user.email)
        const verificationLink = `${process.env.BACKEND_DOMAIN}/api/v1/auth/verify-email/${token}`
        console.log('Email verification link: ', verificationLink)

        const info = await verificationEmail('deepanshu@capitalnumbers.com', user.email, user.fullname, verificationLink)

        res.json({
            success: true,
            data: 'Mail has been resent.',
            verificationLink: verificationLink
        })
    } catch (error) {
        next(error)
    }
}

exports.verifyEmail = async (req, res, next) => {
    try {
        const token = req.params.token
        
        const email = TokenHandler.validateEmailVerificationToken(token).email
        
        const user = User.findOne({ email: email })
        if (!user) throw new MyError(404, 'User is not  registered.')

        await User.findOneAndUpdate({ email: email }, { email_verified: true })

        res.redirect(`${process.env.FRONTEND_DOMAIN}/email-confirmed/${email}`)
    } catch (error) {
        next(error)
    }
}
