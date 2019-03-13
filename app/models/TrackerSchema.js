const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Tracker = new Schema({

    serialKey: {type: String, required: true, unique : true},
    trackerModel: { type: String},
    notes: { type: String},
    vehicle: {type: Schema.Types.ObjectId, ref: 'Transport'},
    metadata: {type: Object},
    status: {type: Boolean}

}, {usePushEach: true});

module.exports = mongoose.model('Tracker', Tracker);
