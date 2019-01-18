//Vai manipular os dados de um tracker ja cadastrado
//Recebe os dados, identifica o tracker enderecado dentro dos dados
//Salva os dados de GPS no veiculo vinculado ao tracker filtrado.

const Tracker = require('../../models/TrackerSchema')
const Transport = require('../../models/TransportSchema')


exports.routes = (data) => {
    
    let dataTracker = {
        id: data.id,
        lat: data.lat,
        long: data.long
    }

    Tracker.findOne({serialKey : dataTracker.id})
    .then(tracker => {
        
        Transport.findById(tracker.vehicle)
        .then(transport => {
            // console.log(transport)
            transport.coordinates.push({
                tracker: dataTracker.id,
                date: new Date(),
                coords: {
                    lat: dataTracker.lat, 
                    long: dataTracker.long,
                }
            })
            return transport.save()
        })
        .catch(err => console.log(err))
    })
    .catch(err => {
        console.log(err)
        return res.status(400).json({
            code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base"
        })
    })
}