const express = require('express')
const router = express.Router()
const userController = require('../controllers/user/userController')
const trackedTransportsController = require('../controllers/transports/transportsController')
const trackersController = require('../controllers/tracker/trackerController')

//Profile routes
router.get('/v1/user/profile', userController.profile)
router.put('/v1/user/profile', userController.updateProfile)
router.put('/v1/user/password', userController.updatePassword)

//Tracked Routes

router.get('/v1/transports/alltransports', trackedTransportsController.getAllTransports)
router.get('/v1/transports/:id', trackedTransportsController.getTransport)
router.put('/v1/transports/:id', trackedTransportsController.linkTrackerToVehicle)
router.post('/v1/transports/registertransport', trackedTransportsController.registerTransport)

//Trackers Routes

router.get('/v1/trackers/alltrackers', trackersController.getAllTrackers)
router.get('/v1/trackers/:id', trackersController.getTracker)
// router.post('/v1/trackers/:id', trackersController.linkTrackerToVehicle)
router.post('/v1/trackers/registertracker', trackersController.registerTrackers)

module.exports = router