const express = require('express')
const router = express.Router()
const userController = require('../controllers/user/userController')
const trackedTransportsController = require('../controllers/transports/transportsController')
const trackersController = require('../controllers/tracker/trackerController')
const userAdminController = require('../controllers/user/userAdminController')
const employeeController = require('../controllers/employee/employeeController')
const routesController = require('../controllers/vehicleRoutes/routesController')

//Transports Routes
router.get('/v1/transports/alltransports', trackedTransportsController.getAllTransports)
router.get('/v1/transports/:id', trackedTransportsController.getTransport)
router.post('/v1/transports/registertransport', trackedTransportsController.registerTransport)
router.put('/v1/transports/linktracker/:id', trackedTransportsController.linkTrackerToVehicle)
router.put('/v1/transports/unlinktracker/:id', trackedTransportsController.unLinkTrackersToVehicle)
router.put('/v1/transports/:id', trackedTransportsController.updateTransport)
router.delete('/v1/transports/:id', trackedTransportsController.deleteTransport)
router.post('/v1/transports/routes/:id', trackedTransportsController.registerRoute)

//Trackers Routes
router.get('/v1/trackers/alltrackers', trackersController.getAllTrackers)
router.get('/v1/trackers/:id', trackersController.getTracker)
router.post('/v1/trackers/registertracker', trackersController.registerTrackers)
router.put('/v1/trackers/:id', trackersController.updateTrackers)
router.delete('/v1/trackers/:id', trackersController.deleteTrackers)

//User routes
router.get('/v1/user/profile', userController.getProfile)
router.put('/v1/user/profile', userController.updateProfile)
router.put('/v1/user/password', userController.updatePassword)
router.delete('/v1/user/profile/autodelete', userController.autoDeleteProfile)   //implementar o selfDelete
// router.get('/v1/user/allprofiles', userController.loadingProfiles)

//User Admin routes
router.get('/v1/admin/allprofiles', userAdminController.loadingProfiles)
router.get('/v1/admin/profile', userAdminController.getProfile)
router.get('/v1/admin/profile/:id', userAdminController.getProfile)
router.put('/v1/admin/profile/:id', userAdminController.updateProfile)
router.put('/v1/admin/password/:id', userAdminController.updatePassword)
router.delete('/v1/admin/profile/:id', userAdminController.deleteProfile)
router.put('/v1/admin/status/:id', userAdminController.updateStatus)


//Employee routes
router.post('/v1/employee/register', employeeController.registerEmployee)
router.get('/v1/employee/allemployees', employeeController.getEmployees)
router.get('/v1/employee/:id', employeeController.getEmployee)
router.put('/v1/employee/:id', employeeController.updateEmployee)
router.get('/v1/employee/disable/:id', employeeController.disableEmployee)


//Routes routes


module.exports = router