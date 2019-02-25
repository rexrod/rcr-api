const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EmployeeRoutes = new Schema({
    employees: [
        {type: Schema.Types.ObjectId, ref: 'Employee'}
    ]

}, {usePushEach: true})

module.exports = mongoose.model('EmployeeRoutes', EmployeeRoutes);