const express = require('express')
const router = express.Router()

const importController = require('../config/importConfigController')
const mqttController = require('../controllers/mqtt/mqttController')

// Import config of clients
router.get('/v1/config/import', importController.importClients)

//MQTT publisher
// router.post('/v1/mqtt/data', mqttController.publisher)

module.exports = router