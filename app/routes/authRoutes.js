const express = require('express')
const router = express.Router()
const userController = require('../controllers/user/userController')
const trackedTransportsController = require('../controllers/transports/transportsController')
const trackersController = require('../controllers/tracker/trackerController')

//Profile routes
router.get('/v1/user/profile', userController.getProfile)
router.get('/v1/user/allprofiles', userController.loadingProfiles)
router.put('/v1/user/profile', userController.updateProfile)
router.put('/v1/user/password', userController.updatePassword)
router.delete('/v1/user/profile/:id', userController.deleteProfile)

//Transports Routes

router.get('/v1/transports/alltransports', trackedTransportsController.getAllTransports)
router.get('/v1/transports/:id', trackedTransportsController.getTransport)
router.post('/v1/transports/registertransport', trackedTransportsController.registerTransport)
router.put('/v1/transports/linktracker/:id', trackedTransportsController.linkTrackerToVehicle)
router.put('/v1/transports/unlinktracker/:id', trackedTransportsController.unLinkTrackersToVehicle)
router.put('/v1/transports/:id', trackedTransportsController.updateTransport)
router.delete('/v1/transports/:id', trackedTransportsController.deleteTransport)

//Trackers Routes

router.get('/v1/trackers/alltrackers', trackersController.getAllTrackers)
router.get('/v1/trackers/:id', trackersController.getTracker)
router.post('/v1/trackers/registertracker', trackersController.registerTrackers)
router.put('/v1/trackers/:id', trackersController.updateTrackers)
router.delete('/v1/trackers/:id', trackersController.deleteTrackers)


module.exports = router