const router = require('express').Router()

const userController = require('./user.controller')
const authVerify = require('../../helpers/middlewares/authVerify')
const { jwtVerify } = require('../../helpers/middlewares/jwtVerify')

router.get('/', userController.showAllUser)
router.post('/register', userController.createUser)
router.get('/dashboard', jwtVerify, authVerify, userController.dashboard)

module.exports = router
