require('dotenv').config()

//VARIAVEIS GLOBAIS
global.PORT = process.env.PORT
global.NAME_API = "LUPA-V1"
global.URI_MONGODB = process.env.URI_MONGODB

//import express configs
let app = require('./app/config/custom-express')()

app.listen(PORT, () => {
  console.log('API-'+NAME_API+'-SERVER-ON: ' + PORT + ' in ' + new Date)
});
