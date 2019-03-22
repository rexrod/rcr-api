//Vai manipular os dados de um tracker ja cadastrado
//Recebe os dados, identifica o tracker enderecado dentro dos dados
//Salva os dados de GPS no veiculo vinculado ao tracker filtrado.
const axios = require('axios')
const Tracker = require('../../models/TrackerSchema')
const Transport = require('../../models/TransportSchema')


exports.routes = (data) => {
    
    let dataTracker = {
        id: data.id,
        lat: data.lat,
        long: data.long
    }

    console.log(data)

    Tracker.findOne({serialKey : dataTracker.id})
    .then(tracker => {
        // console.log(tracker)
        Transport.findById(tracker.vehicle)
        .then(transport => {
            // console.log(transport)

            if ( !transport.tracking ) {
                //mandar sms ativando
                console.log('-----------------------------------------------------------------')
                console.log('carro iniciou')
                console.log('-----------------------------------------------------------------')
                this.sms(transport)
                transport.tracking = true
            }

            
            transport.coordinates.push({
                tracker: dataTracker.id,
                date: new Date(),
                coords: {
                    lat: dataTracker.lat, 
                    long: dataTracker.long,
                }
            })

            this.checkTime(transport, transport.coordinates.length)
            
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

exports.sms = (transport) => {
    // console.log('chamando sms')
    
    let msg;
    let status = transport.tracking ? 'parou' : 'iniciou'
    msg = `O Transporte de placa ${transport.vehiclePlate} ${status} o rastreio.`

    let body = {
      params:{
        metodo: "envio",
        usuario: "app4point",
        senha: 25042018,
        celular: transport.manager,
        mensagem: msg 
      }
    };
    
    axios.get("https://www.iagentesms.com.br/webservices/http.php", body)
      .then(response => {
        console.log("SMS enviado")
        console.log(response.data)
      })
  }

  exports.checkTime = (transport, transportCoords) => {
      setTimeout(()=> {

        Transport.findById(transport._id)
        .then(transport => {

            let coordinatesLen = transport.coordinates.length
    
            if (transportCoords == coordinatesLen) {
                console.log('-----------------------------------------------------------------')
                console.log('carro parou')
                console.log('-----------------------------------------------------------------')
                this.sms(transport)
                transport.tracking = false
                return transport.save()
            }

        })
      }, 30000)
  } 