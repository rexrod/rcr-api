const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const User = new Schema({

    name: {type: String, index: true, unique: true, required: true},
    email: {type: String, index: true, unique: true, required: true},
    registration: {type: String, index: true, unique: true, required: true},
    password: { type: String, required: true },
    status: {type: Boolean, required: true},
    admin: {type: Boolean, required: true},
    metadata: {type: Object},
    updates: {type: Array}

}, {usePushEach: true});

module.exports = mongoose.model('User', User);
