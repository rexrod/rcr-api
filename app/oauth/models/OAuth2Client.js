const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OAuth2ClientSchema = new Schema({

    client_id: {type: String, unique: true},
    client_secret: {type: String},
    client_name: {type: String, required: true},
    client_description: {type: String, required: true},
    client_registered: {type: Date, default: Date.now()},
    grant_types: {type: Array, required: true}

});

module.exports = mongoose.model('OAuth2Client', OAuth2ClientSchema);