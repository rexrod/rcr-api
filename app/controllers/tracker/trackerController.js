//CRUD dos rastreadores
const Tracker = require('../../models/Trackers')
const Transports = require('../../models/TrackedRoutes')
const responses = require('../../config/responses/responses')
const transportsController = require('../../controllers/transports/transportsController')

module.exports = {
    
    registerTrackers: (req, res, next) => {
        console.log(req.body)

        if (req.body.serialKey == undefined || req.body.serialKey == '') {
            return res.status(responses.BAD_REQUEST).json({
                code: responses.BAD_REQUEST,
                error: "invalid_body_register",
                error_description: "ID is required"
            })
        }

        let newTracker = new Tracker(req.body)
        
        newTracker.save()
        .then(result => {
            return res.status(200).json({
                success: true, message: "tracker cadastrado com sucesso", data: result
            })
        })
        .catch(err => {
            console.log(err.message)
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base"
            })
        })
    },

    
    getAllTrackers: (req, res, next) => {
        
        Tracker.find()
        .then(trackers => {
            return res.status(200).json({
                success: true, message: 'transportes carregados', data: trackers
            })
        })
        .catch(err => {
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base"
            })
        })
        
    },
    
    getTracker: (req, res, next) => {
        
        let trackerId = req.params.id
        
        Tracker.findById(trackerId)
        .populate('vehicle')
        .then(tracker => {
            return res.status(200).json({
                success: true, message: 'tracker carregado', data: tracker
            })
        })
        .catch(err => {
            console.log(err.message)
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base / dados nao encontrados"
            })
        })
    },
    
    deleteTrackers: () => {
        
    },
    
    updateTrackers: () => {
        
    },
    
    linkVehicleToTracker: (trackerId, transportId) => {
        // let trackerId = req.params.id
        // let transportToLink = req.body.transportId

        Tracker.findById(trackerId)
        .then(tracker => {
            tracker.vehicle = transportId
            tracker.save()
            .then(result => {
                return {
                    success: true, message: "veiculo cadastrado com sucesso", data: result
                }
            })
        })
    }

    // linkTrackerToVehicle: (req, res, next) => {
    //     let trackerId = req.params.id
    //     let transportToLink = req.body.transportId

    //     Tracker.findById(trackerId)
    //     .then(tracker => {
    //         Transports.findById(transportToLink)
    //         .then(transport => {
    //             transport.tracker = tracker
    //             transport.save()
    //             .then(result => {
    //                 return res.status(200).json({
    //                     success: true, message: "tracker cadastrado com sucesso", data: result
    //                 })
    //             })
    //         })
    //     })
    // },
}