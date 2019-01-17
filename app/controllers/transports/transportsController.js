const responses = require('../../config/responses/responses')
const Transport = require('../../models/TrackedRoutes')
const Tracker = require('../../models/Trackers')

module.exports = {

    registerTransport: (req, res, next) => {

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

        //Verifica se o campo trackerSerial existe
        if (req.body.trackerSerial) {

            Tracker.findOne({serialKey : req.body.trackerSerial})
            .then(tracker => {

                if (tracker == null) {
                    return res.status(400).json({
                        code: 400, error: "invalid_insert", error_description: "Tracker inexistente."
                    })
                }
                //Verifica se o tracker filtrado ja nao esta vinculado a outro veiculo
                if(!tracker.vehicle == undefined || !tracker.vehicle == '') {
                    return res.status(400).json({
                        code: 400, error: "invalid_insert", error_description: "Tracker ja vinculado."
                    })
                }
                          
                let newTransport = new Transport(req.body)

                //Vincula o ID do tracker ao veiculo
                newTransport.tracker = tracker._id

                //Salva transport
                newTransport.save()
                .then(transport => {

                    //Vincula o ID do veiculo ao tracker
                    tracker.vehicle = transport._id

                    //Salva Tracker
                    tracker.save()
                    .then(tracker => {
                        // console.log(tracker)
                        return res.status(200).json({
                            success: true, message: "transporte e tracker cadastrado com sucesso", data: {transport, tracker}
                        })
                    })
                    .catch(err => {
                        return res.status(400).json({
                            code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base,"
                        })
                    })                            
                })
                .catch(err => {
                    return res.status(400).json({
                        code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base,"
                    })
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base,"
                })
            })

        } else {

            //Salva um novo transporte sem tracker associado
            let newTransport = new Transport(req.body)
            newTransport.save()
            .then(transport =>{
                return res.status(200).json({
                    success: true, message: "transporte cadastrado com sucesso.", data: transport
                })
            })
            .catch(err => {
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base,"
                })
            })
        }

    },

    linkTrackerToVehicle: (req, res, next) => {
    
        let transportId = req.params.id
    
        if (!req.body.trackerSerial) {
            return res.status(responses.BAD_REQUEST).json({
                code: responses.BAD_REQUEST,
                error: "invalid_body_parameter",
                error_description: "tracker is required"
            })
        }
    
        Tracker.findOne({serialKey : req.body.trackerSerial})
        .then(tracker => {

            if (tracker == null) {
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "Tracker inexistente."
                })
            }

            if (!tracker.vehicle == null || !tracker.vehicle == '') {
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "Tracker ja vinculado."
                })
            }
            
            //Filtra o transport e vincula o tracker em tranports e trackers
            Transport.findById(transportId)
            .then(transport => {
                
                if (!transport.tracker == null || !transport.tracker == ''){
                    return res.status(400).json({
                        code: 400, error: "invalid_insert", error_description: "Veiculo ja possui tracker vinculado."
                    })
                }
                
                //Vincula o ID do veiculo ao tracker
                tracker.vehicle = transport._id
    
                //Salva o tracker vinculado
                tracker.save()
                .catch(err => {
                    console.log(err)
                    return res.status(400).json({
                        code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base"
                    })
                })
                //Vincula o ID do tracker ao veiculo
                transport.tracker = tracker._id
                transport.trackerSerial = tracker.serialKey
    
                //Salva o transport vinculado
                transport.save()
                .then(result => {
                    return res.status(200).json({
                        success: true, message: "tracker vinculado com sucesso", data: {result, tracker}
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
        .catch(err => {
            console.log(err)
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "Dados invalidos."
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

    deleteTransport: (req, res, next) => {
        
        let transporId = req.params.id

        Transport.findByIdAndRemove(transporId)
        .then(result => {
            if (result == null) {
                return res.status(400).json({
                    code: 400, error: "invalid_insert", error_description: "dados ja removido ou nao existentes na base de dados"
                })
            }
            return res.status(200).json({
                success: true, message: 'transport removido com sucesso', data: result
            })
        })
        .catch(err => {
            console.log(err.message)
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base / dados nao encontrados"
            })
        })
    },

    updateTransport: (req, res, next) => {
        
        let transporId = req.params.id

        // console.log(req.body)

        Transport.findById(transporId)
        .then(transport => {
            transport.type = req.body.type
            transport.capacity = req.body.capacity
            transport.vehiclePlate = req.body.vehiclePlate
            transport.thirdCompany = req.body.thirdCompany

            transport.save()
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
    }

}