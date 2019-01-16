const basicauth = require('basic-auth')
const responses = require('../../config/responses/responses')
const Transport = require('../../models/TrackedRoutes')
const Tracker = require('../../models/Trackers')
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

            if (req.body.trackerSerial) {
                console.log('preenchido')
                trackerController.linkVehicleToTracker(req.body.trackerSerial, transport._id)

                Tracker.findOne({serialKey : req.body.trackerSerial})
                .then(tracker => {
                    transport.tracker = tracker._id
                    transport.save()
                    .then(result => {
                        return res.status(200).json({
                            success: true, message: "transporte e tracker cadastrado com sucesso", data: result
                        })
                    })
                })
            } else {
                return res.status(200).json({
                    success: true, message: "transporte cadastrado com sucesso", data: transport
                })
            }



            // Verifica se o transport possui o campo tracker preenchido - tracker ok
            // if(!transport.tracker == undefined || !transport.tracker == ''){
            //     return res.status(200).json({
            //         success: true, message: "transporte cadastrado com sucesso.", data: transport
            //     })
            // }

            // //Verifica se o campo trackerSerial do formulario esta preenchido - 
            // if (!req.body.trackerSerial == undefined || !req.body.trackerSerial == '') {
            //     // console.log('aqui')
            //     trackerController.linkVehicleToTracker(req.body.trackerSerial, transport._id)
                
            //     // Tracker.find({trackerSerial: trackerSerial})
            //     Tracker.find({serialKey : req.body.trackerSerial})
            //     .then(tracker => {
            //         console.log(tracker)
            //         transport.tracker = tracker._id
            //         transport.save()
            //     })
            // }
            
            // return res.status(200).json({
            //     success: true, message: "transporte cadastrado com sucesso,x", data: transport
            // })

        })
        .catch(err => {
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base"
            })
        })


    },

    linkTrackerToVehicle: (req, res, next) => {
        
        let transportId = req.params.id

        if (req.body.trackerSerial == undefined || req.body.trackerSerial == '') {
            return res.status(responses.BAD_REQUEST).json({
                code: responses.BAD_REQUEST,
                error: "invalid_body_parameter",
                error_description: "tracker is required"
            })
        }

        Tracker.findOne({serialKey : req.body.trackerSerial})
        .then(tracker => {
            if (!tracker.vehicle == null || !tracker.vehicle == '') {
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "Tracker ja vinculado."
                })
            }
            //Filtra o transport e vincula o tracker em tranports e trackers
            Transport.findById(transportId)
            .then(transport => {
                // console.log(transport)
                trackerController.linkVehicleToTracker(req.body.trackerSerial, transportId)
                transport.tracker = tracker._id
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
        })
        .catch(err => console.log(err))
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
        .populate('tracker')
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