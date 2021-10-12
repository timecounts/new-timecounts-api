const passport = require('passport')
const router = require('express').Router()
const { forgotPasswordJwtVerify } = require('../../helpers/middlewares/jwtVerify')

const authController = require('./auth.controller')

// * Google Auth Routes
router.post('/signup/google', authController.googleSignup)
router.post('/google', authController.googleLogin)

// * Facebook Auth routes
router.post('/signup/facebook', authController.facebookSignup)
router.post('/facebook', authController.facebookLogin)

router.post('/login', authController.login)
router.get('/failed', authController.failedLogin)
router.post('/logout', authController.logout)
router.post('/refresh-token', authController.refreshToken)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:id/:token', forgotPasswordJwtVerify, authController.resetPassword)
router.post('/resend-email', authController.resendEmail)
router.get('/verify-email/:token', authController.verifyEmail)

module.exports = router
