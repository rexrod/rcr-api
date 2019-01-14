const OAuthUserAccessToken = require('../models/OAuthUserAccessToken');
const OAuth2Client = require('../models/OAuth2Client');

const User = require('../../models/UserSchema')
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
// const auth = require('basic-auth');
const objectId = require('objectid')
const responses = require('../../config/responses/responses')

const model = module.exports;

const JWT_ISSUER = 'ghost';
const JWT_SECRET_FOR_ACCESS_TOKEN = 'F4$lRr[FLXj43Y`';
const JWT_SECRET_FOR_REFRESH_TOKEN = 'JWPVzFWkqGxoE2C2';

request = "";

//115 dias
model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS = 10000000;

//14 dias
model.JWT_REFRESH_TOKEN_EXPIRY_SECONDS = 1209600;


model.generateToken = function (type, req, callback) {
    console.log('GenerateToken')
    var token;
    var secret;
    var client = req.oauth.client;
    var exp = new Date();
    var payload = {
        iss: JWT_ISSUER,
        //exp: exp,
        //jti: '',
        userId: client.userId
    };

    var options = {
        algorithm: 'HS256'  // HMAC using SHA-256 hash algorithm
    };

    if (type === 'accessToken') {
        secret = JWT_SECRET_FOR_ACCESS_TOKEN;
        exp.setSeconds(exp.getSeconds() + model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS);
    } else {
        secret = JWT_SECRET_FOR_REFRESH_TOKEN;
        exp.setSeconds(exp.getSeconds() + model.JWT_REFRESH_TOKEN_EXPIRY_SECONDS);
    }

    payload.exp = exp.getTime();
    token = JWT.sign(payload, secret, options);

    callback(false, token);


};

model.getAccessToken = function (bearerToken, callback) {
    console.log('GetAccessToken')

    OAuthUserAccessToken.findOne({ 'access_token': bearerToken }, function (err, OAuthUserAccessTokenSearch) {
        if (!OAuthUserAccessTokenSearch) {
            // console.log('deu ruim no token')
            // console.log(OAuthUserAccessTokenSearch)
            return callback();
        }
        User.findById(objectId(OAuthUserAccessTokenSearch.user_id._id), function (err, user) {
            if (!user) {
                return callback();
            }
            if (OAuthUserAccessTokenSearch) {
                callback(null, {
                    accessToken: OAuthUserAccessTokenSearch.access_token,
                    clientId: OAuthUserAccessTokenSearch.client_id,
                    expires: OAuthUserAccessTokenSearch.expires,
                    userId: user          
                });
                
            } else {
                return callback();
            }
        })


    });

}

model.getClient = function (clientId, clientSecret, callback) {
    console.log('GetClient')
    OAuth2Client.findOne({ "client_id": clientId, "client_secret": clientSecret }, function (err, OAuth2ClientSearch) {

        console.log(OAuth2ClientSearch)

        if (err)
            return callback(err);

        if (OAuth2ClientSearch) {
            callback(null, {
                clientId: OAuth2ClientSearch.client_id,
                clientSecret: OAuth2ClientSearch.client_secret,
                redirectUri: OAuth2ClientSearch.redirect_uri,
                userId: OAuth2ClientSearch._id
            });
        } else {
            return callback();
        }
    });

}

model.grantTypeAllowed = function (clientId, grantType, callback) {
    console.log('grantTypeAllowed')
    return callback(false, true);

    // if (grantType === 'password') {
    //     return callback(false, /*authorizedClientIds.indexOf(clientId.toLowerCase()) >= 0*/true);
    // }

};

model.saveAccessToken = function (accessToken, clientId, expires, userId, callback) {
    console.log('SaveAccessToken')
    var token = new OAuthUserAccessToken();
    token.access_token = accessToken;
    token.client_id = clientId;
    token.user_id = userId;
    token.expires = expires;

    token.save(function (err, tokenCreated) {
        callback(err);
    });

};

model.saveRefreshToken = function (refreshToken, clientId, expires, userId, callback) {
    console.log('SaveRefreshToken')
    return callback(false);
};

model.getUser = function (username, password, callback) {
    console.log('GetUser')

    User.findOne({"email" : username}, (err, user) => {
        
        if (user) {

            bcrypt.compare(password, user.password, (err, res) => {
                
                if (err) {
                    console.log(err)
                    callback(err, false);
                }

                callback(err, (res) ? user : false);

            });
        } else {
            console.log(err)
            callback(err, false);
        }
    })
};

model.tokenVerify = function (req, res, next) {
    console.log('TokenVerify')
    try {

        var authorization = req.headers['Authorization'] || req.headers['authorization'];
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            var token = authorization.split(' ')[1];
            if (token) {
                JWT.verify(token, JWT_SECRET_FOR_ACCESS_TOKEN, function (err, decoded) {

                    if (err) {
                        return res.status(responses.UNAUTHORIZED).json(responses.INVALID_AUTHORIZATION)
                    } else {
                        next();
                    }

                });

            } else {
                return res.status(responses.UNAUTHORIZED).json(responses.INVALID_AUTHORIZATION)
            }

        } else {
            next();
        }

    } catch (err) {
        return res.status(responses.INTERNAL_SERVER_ERROR_STATUS_CODE).json(responses.INTERNAL_SERVER_ERROR)
    }
}


model.logout = (user) => {

    OAuthUserAccessToken.find({ "user_id.email" : user.email}).then(tokens => {
        // let tokenId= [];
        
        tokens.forEach(token => {
            // tokenId.push(token._id)
            // console.log(token._id)
            OAuthUserAccessToken.findByIdAndRemove(token._id)
            .then(response => {
                console.log(response)
            })
            .catch(err => console.log(err))
        })
        
        
    })
}



