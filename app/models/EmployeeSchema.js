const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Employee = new Schema({
    name: {type: String, required: true},
    registration: {type: String, index: true, unique: true, required: true},
    company: {type: String},
    status: {type: Boolean, required: true},
    address: {type: String, required: true},
    coordnates: {type: String},
    route: {type: Schema.Types.ObjectId, ref: 'EmployeeRoutes'}
})

module.exports = mongoose.model('Employee', Employee);