//CRUD dos rastreadores
const Tracker = require('../../models/Trackers')
const Transports = require('../../models/TrackedRoutes')
const responses = require('../../config/responses/responses')
const transportsController = require('../../controllers/transports/transportsController')

module.exports = {
    
    registerTrackers: (req, res, next) => {
        // console.log(req.body)
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
            if (tracker == null) {
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base / dados nao encontrados"
                })
            }
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
    
    deleteTrackers: (req, res, next) => {
        let trackerId = req.params.id
        Tracker.findByIdAndRemove(trackerId)
        .then(result => {
            if (result == null) {
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "dados ja removido ou nao existentes na base de dados"
                })
            }
            return res.status(200).json({
                success: true, message: 'tracker removido com sucesso', data: result
            })
        })
        .catch(err => {
            console.log(err.message)
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base / dados nao encontrados"
            })
        })
        
    },
    
    updateTrackers: (req, res, next) => {
        let trackerId = req.params.id

        console.log(req.body)

        Tracker.findById(trackerId)
        .then(tracker => {
            tracker.trackerModel = req.body.trackerModel
            tracker.notes = req.body.notes
            tracker.vehicle = req.body.vehicle

            tracker.save()
            .then(result => {
                return res.status(200).json({
                    success: true, message: "tracker atualizado com sucesso", data: result
                })
            })
            .catch(err => {
                console.log(err.message)
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base"
                })
            })
        })
    },
    
    linkVehicleToTracker: (serialKey, transportId) => {
        // let trackerId = req.params.id
        // let transportToLink = req.body.transportId
        
        Tracker.findOne({serialKey : serialKey})
        .then(tracker => {
            if(tracker.vehicle == undefined || tracker.vehicle == '') {
                tracker.vehicle = transportId
                tracker.save()
                .then(result => {
                    return {
                        success: true, message: "veiculo cadastrado com sucesso", data: result
                    }
                })
                .catch(err => console.log(err))
            }
            
            return {
                code: 400, error: "invalid_insert", error_description: "tracker ja possui veiculo vinculado"
            }

        })
        .catch(err => console.log(err))
    }
}