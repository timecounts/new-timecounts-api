const passport = require('passport')
const router = require('express').Router()
const { forgotPasswordJwtVerify } = require('../../helpers/middlewares/jwtVerify')

const authController = require('./auth.controller')

// * Google Authentication Strategy
require('../../helpers/auth/googleAuth')(passport)

// * Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    authController.thirdPartyAuthCallback
)

// * Facebook Authentication Strategy
require('../../helpers/auth/facebookAuth')(passport)

// * Facebook Auth routes
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }))

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/failed' }),
    authController.thirdPartyAuthCallback
)

router.post('/login', authController.login)
router.get('/failed', authController.failedLogin)
router.get('/logout', authController.logout)
router.delete('/logout', authController.jwtLogout)
router.post('/refresh-token', authController.refreshToken)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:id/:token', forgotPasswordJwtVerify, authController.resetPassword)

module.exports = router
