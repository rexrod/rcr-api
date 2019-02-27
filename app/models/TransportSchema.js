const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Transport = new Schema({

    type: { type: String, required: true },
    capacity: { type: String, required: true },
    vehiclePlate: { type: String, required: true },
    trackerSerial: { type: String },
    tracker: { type: Schema.Types.ObjectId, ref: 'Tracker' },
    routes: {
        employees: [
            { type: Schema.Types.ObjectId, ref: 'Employee' }
        ]
    },
    coordinates: { type: Array },
    thirdCompany: { type: String },
    segment: { type: String },
    description: { type: String },
    metadata: { type: Object },
    status: {type: Boolean, required: true}

}, { usePushEach: true });

module.exports = mongoose.model('Transport', Transport);
