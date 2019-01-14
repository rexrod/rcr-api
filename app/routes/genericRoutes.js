const express = require('express')
const router = express.Router()

const importController = require('../controllers/importConfigController')
const mqttController = require('../controllers/mqttController')

// Import Routes
router.get('/v1/config/import', importController.importClients)
router.post('/v1/mqtt/data', mqttController.publisher)

module.exports = router