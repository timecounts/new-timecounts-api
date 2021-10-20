const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")
const redis = require('./redis')

// * Jsonwebtoken Keys
const JWT_SIGN_KEY = fs
    .readFileSync(path.resolve(__dirname, '../../../jwtSign.key'))
    .toString()
const JWT_TOKEN_OPTIONS = {
    issuer: process.env.BACKEND_DOMAIN,
    algorithm: "HS512",
    expiresIn: "60d", // 60days
}

// * Refresh Token keys
const REFRESH_SIGN_KEY = fs
    .readFileSync(path.resolve(__dirname, '../../../refreshSecret.key'))
    .toString()
const REFRESH_TOKEN_OPTIONS = {
    issuer: process.env.BACKEND_DOMAIN,
    algorithm: 'HS512',
    expiresIn: '1y'   // 1year
}

exports.generateToken = payload => {
    return jwt.sign(payload, JWT_SIGN_KEY, JWT_TOKEN_OPTIONS)
}

exports.forgotPasswordToken = user => {

    const payload = {
        email: user.email,
        id: user._id
    }

    const secret = JWT_SIGN_KEY + user.password
    let options = JWT_TOKEN_OPTIONS
    options['expiresIn'] = '5m'

    return jwt.sign(payload, secret, options)
}

exports.signRefreshToken = userId => {
        let options = REFRESH_TOKEN_OPTIONS
        options['audience'] = userId.toString()

        const token = jwt.sign({}, REFRESH_SIGN_KEY, REFRESH_TOKEN_OPTIONS)
        const setSuccess = redis.set(userId, token)
        const expireSuccess = redis.expire(userId, 365 * 24 * 60 * 60)

        if (setSuccess && expireSuccess) return token
        return false
}

exports.decodeToken = token => {
    return jwt.decode(token)
}

exports.validateToken = token => {
    return jwt.verify(token, JWT_SIGN_KEY, {
        algorithms: ["HS512"]
    })
}

exports.validateRefreshToken = token => {
    const payload = jwt.verify(token, REFRESH_SIGN_KEY, {
        algorithms: ["HS512"]
    })

    return new Promise((resolve, reject) => {
        redis.get(payload.aud, (error, reply) => {
            if (error) resolve(null)
            if (reply === token) resolve(payload.aud)
            resolve('unauthorized')
        })
    })
}

exports.validateForgotPasswordToken = (user, token) => {
    const secret = JWT_SIGN_KEY + user.password
    return jwt.verify(token, secret, {
        algorithms: ["HS512"]
    })
}

exports.emailVerificationToken = email => {
    const payload = {
        email: email
    }

    let options = JWT_TOKEN_OPTIONS
    options['expiresIn'] = '24h'

    return jwt.sign(payload, JWT_SIGN_KEY, options)
}

exports.validateEmailVerificationToken = token => {
    let options = JWT_TOKEN_OPTIONS
    options['expiresIn'] = '24h'

    return jwt.verify(token, JWT_SIGN_KEY, options)
}

exports.organizationApprovalToken = id => {
    const payload = {
        id: id
    }

    let options = JWT_TOKEN_OPTIONS
    options['expiresIn'] = '24h'

    return jwt.sign(payload, JWT_SIGN_KEY, options)
}

exports.validateOrganizationApprovalToken = token => {
    let options = JWT_TOKEN_OPTIONS
    options['expiresIn'] = '24h'

    return jwt.verify(token, JWT_SIGN_KEY, options)
}
