const router = require('express').Router()

const authRoute = require('../api/auth/auth.route')
const userRoute = require('../api/user/user.route')

router.use('/auth', authRoute)
router.use('/user', userRoute)

module.exports = router