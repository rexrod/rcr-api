const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Employee = new Schema({

    name: {type: String, index: true, unique: true, required: true},
    email: {type: String, index: true, unique: true, required: true},
    department: {type: String, required: true},
    registration: {type: String, required: true},
    cellphone: {type: String, required: true },
    password: { type: String, required: true },
    img: {type: String},
    metadata: {type: Object},
    firebase: {type: Array},
    logs: {type: Array},
    support: {type: Boolean}


}, {usePushEach: true});

module.exports = mongoose.model('EmployeeV3', Employee);
