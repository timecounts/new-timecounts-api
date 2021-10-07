const User = require('../../api/user/user.model')
const MyError = require('../../error/MyError')
const { validateToken, validateForgotPasswordToken } = require('../jsonwebtoken')

const jwtVerify = async (req, res, next) => {
    try {
        let token

        try {
            token = req.headers.authorization.split(' ')[1]
        } catch (error) {
            throw new MyError(400, 'Token not found or is in inappropriate format.')
        }

        try {
            const decoded = validateToken(token)
            req.user = decoded.id
        } catch (error) {
            throw new MyError(401, 'The token is either invalid or expired!')
        }

        next()
    } catch (error) {
        next(error)
    }
}

const forgotPasswordJwtVerify = async (req, res, next) => {
    try {
        const { id, token } = req.params
        const user = await User.findById(id)

        if (user === null) throw new MyError(404, 'User does not exist.')

        try {
            const decoded = validateForgotPasswordToken(user, token)
            console.log('Decoded ', decoded)
            req.user = decoded.id
        } catch (error) {
            throw new MyError(401, 'The token is either invalid or expired!')
        }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    jwtVerify,
    forgotPasswordJwtVerify
}