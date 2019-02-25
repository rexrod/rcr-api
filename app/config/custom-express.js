const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const genericRoutes = require('../routes/genericRoutes')
const authRoutes = require('../routes/authRoutes')


const oauthserver = require('oauth2-server')
const OAuth2Controller = require('../oauth/controllers/OAuth2Controller')
const UserController = require('../controllers/user/userController')

require('./data-base/database')()
require('../controllers/mqtt/mqtt-client')

module.exports = function () {
  let app = express();

  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }))
  app.use(bodyParser.json())
  app.use(cors());
  app.use(express.static('public'));


  //Generic routes
  app.use('/', genericRoutes)


  //Oauth2 
  app.oauth = oauthserver({
    model: OAuth2Controller,
    grants: ['password', 'refresh_token'],
    debug: true,
    accessTokenLifetime: OAuth2Controller.JWT_ACCESS_TOKEN_EXPIRY_SECONDS, // expiry time in seconds, consistent with JWT setting in model.js
    refreshTokenLifetime: OAuth2Controller.JWT_REFRESH_TOKEN_EXPIRY_SECONDS // expiry time in seconds, consistent with JWT setting in model.js
  });

  app.post('/v1/oauth2/token', UserController.checkStatus); //check account status
  app.post('/v1/oauth2/token', app.oauth.grant()); //login
  app.post('/v1/oauth2/register', UserController.register); //register new user

  app.use(function (req, res, next) {
    OAuth2Controller.tokenVerify(req, res, next);
  }) //  //Check se a Assinatura válida.
  app.use(app.oauth.authorise()); // Se a assinatura é válida checar na base para obter detalhes desse token (Client, User, dentre outros).

  
  //Rotas protegidas pelo oauth
  app.use('/auth', authRoutes)

  app.use(app.oauth.errorHandler()); //Exibicao de Erros

  return app;
}