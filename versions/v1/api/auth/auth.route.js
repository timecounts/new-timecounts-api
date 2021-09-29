const passport = require('passport')
const router = require('express').Router()
const { forgotPasswordJwtVerify } = require('../../helpers/middlewares/jwtVerify')

const authController = require('./auth.controller')

// * Google Authentication Strategy
require('../../helpers/auth/googleAuth')

// * Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }), 
    (req, res) => {

        // * Successful authenticated
        res.json({
            success: true,
            message: 'Successfully logged into your Google Account.'
        })
    }
)

// * Facebook Authentication Strategy
require('../../helpers/auth/facebookAuth')(passport, 5000)

// * Facebook Auth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['profile', 'email'] }))

router.get(
    '/facebook/callback', 
    passport.authenticate('facebook', { failureRedirect: '/failed' }),
    (req, res) => {
        // * Successful authenticated
        res.json({
            success: true,
            message: 'Successfully logged into your Facebook Account.'
        })
    }
)




router.post('/login', authController.login)
router.get('/failed', authController.failedLogin)
router.get('/logout', authController.logout)
router.delete('/logout', authController.jwtLogout)
router.post('/refresh-token', authController.refreshToken)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:id/:token', forgotPasswordJwtVerify, authController.resetPassword)

module.exports = router
