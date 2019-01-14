var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://iot.eclipse.org')

let data = {
    id : '1321',
    coord: '-3.0936677,-59.9714751'
}

setTimeout(() => {
    client.publish('gps-tracker/position', JSON.stringify(data))
    return
}, 2000)