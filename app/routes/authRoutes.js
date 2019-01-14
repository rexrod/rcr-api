const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

//Profile routes

router.get('/v1/user/profile', userController.profile)
router.put('/v1/user/profile', userController.updateProfile)
router.put('/v1/user/password', userController.updatePassword)


module.exports = router