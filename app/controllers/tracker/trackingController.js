//Vai manipular os dados de um tracker ja cadastrado

const Tracker = require('../../models/Trackers')

module.exports = {
    routes: (data) => {
        // console.log(data)

        let dataTracker = {
            id: data.id,
            lat: data.lat,
            long: data.long
        }

        Tracker.findOne({serialKey : dataTracker.id})
        .then(tracker => {
            console.log(tracker)
            tracker.coordinates.push({
                lat: dataTracker.lat, 
                long: dataTracker.long,
                date: new Date()
            })
            return tracker.save()
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base"
            })
        })

    }
}