const basicauth = require('basic-auth')
const responses = require('../../config/responses/responses')
const Transport = require('../../models/TrackedRoutes')
const trackerController = require('../../controllers/tracker/trackerController')

module.exports = {

    registerTransport: (req, res, next) => {
        // console.log(req.body)

        //Verifica se algum campo passado nao consta como undefined
        if (req.body.type == undefined || req.body.capacity == undefined || req.body.vehiclePlate == undefined ||
            req.body.thirdCompany == undefined ||req.body.type == '' || req.body.capacity == '' || req.body.vehiclePlate == '' ||
            req.body.thirdCompany == '') {

            return res.status(responses.BAD_REQUEST).json({
                code: responses.BAD_REQUEST,
                error: "invalid_body_register",
                error_description: "type, capacity, vehiclePlate and thirdCompany are required"
            })
        }

        let newTransport = new Transport(req.body)
        newTransport.save()
        .then(transport => {
            if (req.body.trackerId !== undefined || req.body.trackerId !== '') {
                trackerController.linkVehicleToTracker(req.body.trackerId, transport._id)
                transport.tracker = req.body.trackerId
                transport.save()
            }
            
            return res.status(200).json({
                success: true, message: "transporte cadastrado com sucesso", data: transport
            })

        })
        .catch(err => {
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base"
            })
        })


    },

    linkTrackerToVehicle: (req, res, next) => {
        
        let transportId = req.params.id

        if (req.body.trackerId == undefined || req.body.trackerId == '') {
            return res.status(responses.BAD_REQUEST).json({
                code: responses.BAD_REQUEST,
                error: "invalid_body_register",
                error_description: "tracker is required"
            })
        }

        Transport.findById(transportId)
        .then(transport => {
            trackerController.linkVehicleToTracker(req.body.trackerId, transportId)
            transport.tracker = req.body.trackerId
            transport.save()
            .then(result => {
                return res.status(200).json({
                    success: true, message: "tracker vinculado com sucesso", data: result
                })
            })
            .catch(err => {
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base"
                })
            })
        })
        .catch(err => {
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base"
            })
        })
    },

    getAllTransports: (req, res, next) => {
        Transport.find()
        .then(transports => {
            return res.status(200).json({
                success: true, message: 'transportes carregados', data: transports
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base"
            })
        })
    },

    getTransport: (req, res, next) => {

        let transportId = req.params.id

        Transport.findById(transportId)
        .then(transport => {
            return res.status(200).json({
                success: true, message: 'transporte carregado', data: transport
            })
        })
        .catch(err => {
            console.log(err.message)
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base / dados nao encontrados"
            })
        })
    },

    deleteTransport: () => {

    },

    updateTransport: () => {

    }

}