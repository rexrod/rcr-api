require('dotenv').config()

//VARIAVEIS GLOBAIS
global.PORT = process.env.PORT
global.NAME_API = "LUPA-V1"
global.URI_MONGODB = process.env.URI_MONGODB
// global.TOKEN_OS = "Basic ZjY0NWQ5MjctODYwNy00MGFjLWE4YjQtNDBmNjM4ZDBmZWI1"
// global.URL_ONESIGNAL = "https://onesignal.com/api/v1/notifications"
// global.OS_APP_ID = "fe12a49c-c243-4e54-b71b-3aa2e1fa113b"
// global.URL_FIREBASE = "https://fcm.googleapis.com/fcm/send"
// global.TOKEN_FB = "key=AAAAPaLK_yI:APA91bGWLYR-xXo_ohKnB4iaPS728j2iFt8VRnxkEg_8hJzHMYz--gFcDaKzwg8tYVwTSPMhBSRoLN97jpmMTMuFNETwECxQs6_XQgCpfr1vxmZVEgxG1DuYVrqeftxXh5OcQ4dVnTTv"
// global.URL_TOTALVOICE = "https://api.totalvoice.com.br/audio"
// global.TOKEN_TOTALVOICE = "fee79afdb53c66aa280bedfdad139838"

//import express configs
let app = require('./app/config/custom-express')()

app.listen(PORT, () => {
  console.log('API-'+NAME_API+'-SERVER-ON: ' + PORT + ' in ' + new Date)
});
