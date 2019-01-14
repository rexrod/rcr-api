//Controller para simulacao de publisher, metodo que sera usado pelo tracker

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://iot.eclipse.org')


module.exports = {
    publisher: (req, res, next) => {
        // console.log(req.body)

        let data = {
            id : req.body.id,
            lat: req.body.lat,
            long: req.body.long
        }

        client.publish('gps-tracker/position', JSON.stringify(data))

        res.status(200).json(data)

    }

}