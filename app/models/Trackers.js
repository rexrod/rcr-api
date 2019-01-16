const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Tracker = new Schema({

    serialKey: {type: String, required: true},
    notes: { type: String},
    vehicle: {type: Schema.Types.ObjectId, ref: 'Routesv1'},
    metadata: {type: Object},
    coordinates: {type: Array}

}, {usePushEach: true});

module.exports = mongoose.model('Trackersv1', Tracker);
