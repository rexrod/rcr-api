const express = require('express')
const router = express.Router()
const userController = require('../controllers/user/userController')
const trackedTransportsController = require('../controllers/transports/transportsController')
const trackersController = require('../controllers/tracker/trackerController')
// const linkTrackersController = require('../controllers/linkTrackers/linkTrackersController')

//Profile routes
router.get('/v1/user/profile', userController.profile)
router.put('/v1/user/profile', userController.updateProfile)
router.put('/v1/user/password', userController.updatePassword)

//Transports Routes

router.get('/v1/transports/alltransports', trackedTransportsController.getAllTransports)
router.get('/v1/transports/:id', trackedTransportsController.getTransport)
router.post('/v1/transports/registertransport', trackedTransportsController.registerTransport)
router.put('/v1/transports/linktracker/:id', trackedTransportsController.linkTrackerToVehicle)
router.put('/v1/transports/:id', trackedTransportsController.updateTransport)
router.delete('/v1/transports/:id', trackedTransportsController.deleteTransport)

//Trackers Routes

router.get('/v1/trackers/alltrackers', trackersController.getAllTrackers)
router.get('/v1/trackers/:id', trackersController.getTracker)
router.post('/v1/trackers/registertracker', trackersController.registerTrackers)
router.put('/v1/trackers/:id', trackersController.updateTrackers)
router.delete('/v1/trackers/:id', trackersController.deleteTrackers)


module.exports = router