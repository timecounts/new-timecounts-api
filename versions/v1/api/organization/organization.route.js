const router = require('express').Router()

const organizationController = require('./organization.controller')
const { jwtVerify } = require('../../helpers/middlewares/jwtVerify')

router.post('/add', jwtVerify, organizationController.createOrganization)
router.post('/url-check', jwtVerify, organizationController.organizationUrlExist)
router.get('/verify-organization/:token', organizationController.verifyOrganization)

module.exports = router
