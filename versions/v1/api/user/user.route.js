const router = require('express').Router()

const userController = require('./user.controller')
const { jwtVerify } = require('../../helpers/middlewares/jwtVerify')

router.get('/', jwtVerify, userController.showAllUser)
router.post('/signup', userController.createUser)
router.get('/dashboard', jwtVerify, userController.dashboard)

module.exports = router
