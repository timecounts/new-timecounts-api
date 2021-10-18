const router = require('express').Router()

const authRoute = require('../api/auth/auth.route')
const userRoute = require('../api/user/user.route')
const organizationRoute = require('../api/organization/organization.route')

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/organization', organizationRoute)

module.exports = router