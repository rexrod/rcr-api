const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employeeController')

//Profile routes

router.get('/v1/employee/profile', employeeController.profile)
router.put('/v1/employee/profile', employeeController.updateProfile)
router.put('/v1/employee/password', employeeController.updatePassword)


module.exports = router