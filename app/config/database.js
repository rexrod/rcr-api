
const mongoose = require('mongoose');

module.exports = function (config)
{
    // let dsn = 'mongodb://soofi:652166fe@ds245210.mlab.com:45210/soofi'
    // let dsn = 'mongodb://root:123@localhost:27017/soofi' 
    // console.log(URI_MONGODB)
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