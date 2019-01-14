const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Tracker = new Schema({

    serialKey: {type: String, required: true},
    macAddress: {type: String, required: true},
    notes: { type: String},
    vehicle: {type: String},
    metadata: {type: Object},
    route: {type: Schema.Types.ObjectId, ref: 'Routesv1'}

}, {usePushEach: true});

module.exports = mongoose.model('Trackersv1', Tracker);
