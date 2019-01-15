
const mongoose = require('mongoose');

module.exports = function (config)
{
    let dsn = URI_MONGODB

    mongoose.Promise = require('bluebird');
    if(mongoose.connection.readyState ==0)
    {
        mongoose.connect(
            dsn,
            {
                useMongoClient: true 
            }

        );
    }

    return mongoose;
}