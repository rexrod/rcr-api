//CRUD dos rastreadores
const Tracker = require('../../models/TrackerSchema')
const Transport = require('../../models/TransportSchema')
const responses = require('../../config/responses/responses')
    
exports.registerTrackers = (req, res, next) => {
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

exports.getAllTrackers = (req, res, next) => {
    
    Tracker.find()
    .then(trackers => {
        return res.status(200).json({
            success: true, message: 'trackers carregados', data: trackers
        })
    })
    .catch(err => {
        return res.status(400).json({
            code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base"
        })
    })
    
},

exports.getTracker = (req, res, next) => {
    
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

exports.deleteTrackers = (req, res, next) => {
    let trackerId = req.params.id
    Tracker.findByIdAndRemove(trackerId)
    .then(result => {
        if (result == null) {
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "dados ja removido ou nao existentes na base de dados"
            })
        }
        
        if (result.vehicle) {
            Transport.findById(result.vehicle)
            .then(transport => {
                transport.tracker = req.body.tracker
                transport.trackerSerial = req.body.trackerSerial
                transport.save() 
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

exports.disableTrackers = (req, res, next) => {
    let trackerId = req.params.id
    Tracker.findByIdAndUpdate(trackerId)
    .then(result => {
        if (result == null) {
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "dados ja removido ou nao existentes na base de dados"
            })
        }

        result.status = false
        result.save()
        
        return res.status(200).json({
            success: true, message: 'tracker desativado com sucesso', data: result
        })
    })
    .catch(err => {
        console.log(err.message)
        return res.status(400).json({
            code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base / dados nao encontrados"
        })
    })
    
},

exports.updateTrackers = (req, res, next) => {
    let trackerId = req.params.id

    console.log(req.body)

    Tracker.findByIdAndUpdate(trackerId)
    .then(tracker => {
        tracker.trackerModel = req.body.trackerModel
        tracker.notes = req.body.notes
        // tracker.vehicle = req.body.vehicle

        return tracker.save()
    })
    .then(result => {
        return res.status(200).json({
            success: true, message: "tracker atualizado com sucesso", data: result
        })
    })
    .catch(err => {
        console.log(err.message)
        return res.status(400).json({
            code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base / ou dados nao encontrados"
        })
    })
}