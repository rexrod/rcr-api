const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EmployeeRoutes = new Schema({
    route: {type: Array},
    employees: {type: Schema.Types.ObjectId, ref: 'Employee'},
})

module.exports = mongoose.model('EmployeeRoutes', EmployeeRoutes);