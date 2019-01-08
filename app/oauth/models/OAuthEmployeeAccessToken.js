const db = require('mongoose')
const Schema = db.Schema;


const OAuthEmployeeAccessToken = new Schema({

    access_token: {type: String, required: true},
    client_id: {type: String, required: true},
    user_id : { type: Object, required: true},
    expires: {type: Date}

});

module.exports = db.model('OAuthEmployeeAccessToken', OAuthEmployeeAccessToken);



// Verificar a mudanca do {type: String} em user_id para {type: Schema.Types.ObjectId}