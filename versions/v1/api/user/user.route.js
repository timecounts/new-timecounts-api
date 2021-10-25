const router = require('express').Router()

const userController = require('./user.controller')
const { jwtVerify } = require('../../helpers/middlewares/jwtVerify')

router.get('/', jwtVerify, userController.showAllUser)
router.post('/signup', userController.createUser)
router.patch('/', jwtVerify, userController.updateUser)

module.exports = router
