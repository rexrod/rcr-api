const db = require('mongoose')
const Schema = db.Schema;


const OAuthUserAccessToken = new Schema({

    access_token: {type: String, required: true},
    client_id: {type: String, required: true},
    user_id : { type: Object, required: true},
    expires: {type: Date}

});

module.exports = db.model('OAuth2UserAccessToken', OAuthUserAccessToken);



// Verificar a mudanca do {type: String} em user_id para {type: Schema.Types.ObjectId}