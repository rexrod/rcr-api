const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Tracker = new Schema({

    serialKey: {type: String, required: true, unique : true},
    trackerModel: { type: String},
    notes: { type: String},
    vehicle: {type: Schema.Types.ObjectId, ref: 'Routesv1'},
    metadata: {type: Object},
    status: {type: Boolean}

}, {usePushEach: true});

module.exports = mongoose.model('Trackersv1', Tracker);
