const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')

const dfRoutes = require('../routes/dfRoutes')
const authRoutes = require('../routes/authRoutes')


const oauthserver = require('oauth2-server')
const OAuth2Controller = require('../oauth/controllers/OAuth2Controller')
const employeeController = require('../controllers/employeeController')

require('./database')()

module.exports = function () {
  let app = express();

  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }))
  app.use(bodyParser.json())
  app.use(cors());
  app.use(express.static('public'));


  //Dialogflow routes
  app.use('/df', dfRoutes)


  //Oauth2 
  app.oauth = oauthserver({
    model: OAuth2Controller,
    grants: ['password', 'refresh_token'],
    debug: true,
    accessTokenLifetime: OAuth2Controller.JWT_ACCESS_TOKEN_EXPIRY_SECONDS, // expiry time in seconds, consistent with JWT setting in model.js
    refreshTokenLifetime: OAuth2Controller.JWT_REFRESH_TOKEN_EXPIRY_SECONDS // expiry time in seconds, consistent with JWT setting in model.js
  });


  app.post('/v1/oauth2/token', app.oauth.grant()); //login
  app.post('/v1/oauth2/register', employeeController.register); //register new user

  app.use(function (req, res, next) {
    OAuth2Controller.tokenVerify(req, res, next);
  }) //  //Check se a Assinatura válida.
  app.use(app.oauth.authorise()); // Se a assinatura é válida checar na base para obter detalhes desse token (Client, User, dentre outros).



  //Multer midleware to upload profile photos
  const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'app/images')
    },
    filename: (req, file, cb) => {
      let filename = file.originalname
      let pathFileName = filename.split(' ').join('')
      cb(null, req.user.id._id + pathFileName)
    }
  })

  app.use(multer({
    storage: imageStorage
  }).single('image')) //o campo .single('image') se refere a uma unica imagem com um input com name="image".


  // app.use(multer().single('image'))

  
  //Rotas protegidas pelo oauth
  app.use('/', authRoutes)

  app.use(app.oauth.errorHandler()); //Exibicao de Erros

  return app;
}