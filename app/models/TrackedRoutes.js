const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Routes = new Schema({

    type: {type: String, required: true},
    capacity: {type: String, required: true},
    vehiclePlate: { type: String, required: true },
    trackerSerial: {type: String},
    tracker: {type: Schema.Types.ObjectId, ref: 'Trackersv1'},
    coordinates: {type: Array},
    thirdCompany: {type: String},
    metadata: {type: Object}

}, {usePushEach: true});

module.exports = mongoose.model('Routesv1', Routes);
