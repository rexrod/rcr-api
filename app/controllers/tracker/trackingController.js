//Vai manipular os dados de um tracker ja cadastrado

const Tracker = require('../../models/Trackers')
const Transport = require('../../models/TrackedRoutes')

module.exports = {
    routes: (data) => {
        
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
}