const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Employee = new Schema({
    name: {type: String, required: true},
    registration: {type: String, index: true, unique: true, required: true},
    status: {type: Boolean, required: true},
    address: {type: String, required: true},
    meetingPoint: {type: Schema.Types.ObjectId, ref: 'MeetingPoint'}
})

module.exports = mongoose.model('Employee', Employee);