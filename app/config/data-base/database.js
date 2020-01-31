
const mongoose = require('mongoose');

module.exports = function (config)
{
    let dsn = 'mongodb://rcradmin:rXVuLO1k6XcVl5EX@rcr-v1-shard-00-00-u3av8.mongodb.net:27017,rcr-v1-shard-00-01-u3av8.mongodb.net:27017,rcr-v1-shard-00-02-u3av8.mongodb.net:27017/rcr-db?ssl=true&replicaSet=rcr-v1-shard-0&authSource=admin&retryWrites=true'


    mongoose.Promise = require('bluebird');

    if(mongoose.connection.readyState ==0) {
        mongoose.connect(dsn, {useMongoClient: true});
    }

    return mongoose;
}
