//Controlador do client MQTT 
const mqtt = require('mqtt')
// const client  = mqtt.connect('mqtt://broker.mqttdashboard.com')
const client  = mqtt.connect('mqtt://iot.eclipse.org')

const trackingController = require('../tracker/trackingController')

client.on('connect', (err) => {
    console.log('MQTT connected')  
    client.subscribe('gps-tracker/position')
    client.subscribe('gps-tracker/string')
})

client.on('message', (topic, message) => {
    console.log('mensagem...')
    if(topic === 'gps-tracker/position') {
        //log message
        console.log(JSON.parse(message.toString())) //parse da message para Json
        let data = JSON.parse(message.toString())
        trackingController.routes(data)
        
        //handle message to mongodb...
        // ...
    }else if(topic === 'gps-tracker/string') {
        //log message
        console.log(message.toString()) //parse da message para Json
        console.log('')
        
        //handle message to mongodb...
        // ...
    }
})