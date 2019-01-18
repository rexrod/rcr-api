const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const User = new Schema({

    name: {type: String, index: true, unique: true, required: true},
    email: {type: String, index: true, unique: true, required: true},
    password: { type: String, required: true },
    registration: {type: String, required: true},
    metadata: {type: Object},
    updates: {type: Array}

}, {usePushEach: true});

module.exports = mongoose.model('User', User);
