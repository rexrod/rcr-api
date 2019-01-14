const splitByWhitespace = require("string-split-by-whitespace")
const bcrypt = require('bcrypt')
const basicauth = require('basic-auth')
const fs = require('fs')
const path = require('path')

const responses = require('../config/responses/responses')

//CRUD do usuario do sistema

const User = require('../models/UserSchema')

const OAuth2Controller = require('../oauth/controllers/OAuth2Controller')
const OAuth2Client = require('../oauth/models/OAuth2Client')


module.exports = {

    register: (req, res, next) => {
        let client = basicauth(req)
        
        //Verifica se os campos do client usado para cadastro foi passado por completo
        if (client.name == "" || client.pass == "") {
            return res.status(responses.BAD_REQUEST).json({
                code: 400,
                error: "invalid_basic_auth",
                error_description: "username and pass are required"
            })
        }

        //Verifica se o headers da requisicao esta de acordo com application/x-www-form-urlencoded
        if (req.headers['content-type'] != "application/x-www-form-urlencoded") {

            return res.status(400).json({
                code: 400,
                error: "invalid_request",
                error_description: "Method must be POST with application/x-www-form-urlencoded encoding"
            })
        }
        
        //Verifica se o client informado consta na base de dados
        // OAuth2Client.findOne({ "client_id": client.name, "client_secret": client.pass }, (err, OAuth2Client) => {
        OAuth2Client.findOne({ "client_id": client.name, "client_secret": client.pass })
            .then(OAuth2Client => {
            
                //Nao encontrado -> retorna invalido
                if (!OAuth2Client) {
                    return res.status(responses.BAD_REQUEST).json({
                        code: responses.BAD_REQUEST,
                        error: "invalid_basic_auth",
                        error_description: "credentials invalid"
                    })
                }               


                console.log(req.body.password)
                //Verifica se algum campo passado nao consta como undefined
                if (req.body.name == undefined || req.body.email == undefined || req.body.password == undefined ||
                    req.body.name == '' || req.body.email == '' || req.body.password == '') {
                    return res.status(responses.BAD_REQUEST).json({
                        code: responses.BAD_REQUEST,
                        error: "invalid_body_register",
                        error_description: "name, email and password are required"
                    })
                }


                //Verifica se ja existe um usuario cadastrado na base de dados via o email repassado na requisicao
                User.findOne({"email" : req.body.email})
                    .then(user => {

                        //Se o usuario foi encontrado, retorna um erro informado que ja existe cadastro
                        if (user){
                            return res.status(responses.BAD_REQUEST).json({
                                code: responses.BAD_REQUEST,
                                error:"username_invalid",
                                error_description: "username is being used"
                            })
                        }
                        
                        //Verifica se o dominio do email esta autorizado a criar conta no sistema
                        const emails = ['itbam.org.br', 'gmail.com', 'teste.com']
                        let domain = req.body.email.split('@') 

                        if (!emails.includes(domain[1])) {
                            return res.status(responses.BAD_REQUEST).json({
                                code: responses.BAD_REQUEST,
                                error:"email invalid",
                                error_description: "You need an authorized email."
                            })
                        }
                        
                        //separa cada nome do nome completo do usuario
                        // let namelower = req.body.name.toLowerCase()
                        // let namesplit = namelower.split(' ')
                        // let namecount = namesplit.length
                    
                        //Cria um novo usuario com base no Schema de User
                        let userdb = new User(req.body)
                        userdb.password = bcrypt.hashSync(req.body.password, 5)


                        //Parse de data e hora 
                        let date = new Date()
                        let hour = date.getHours() - 4
                        let minutes = date.getMinutes()

                        let parseHour = ("0" + hour).slice(-2)
                        let parseMinut = ("0" + minutes).slice(-2)

                        let metadata = {
                            account_registred: {                                
                                date:  `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`,
                                hour: `${parseHour}:${parseMinut}`
                            }
                        }
                    
                        userdb.metadata = metadata
                        
                        return userdb.save()
                    })
                    .then(user => {
                        return res.status(responses.CREATED).json({
                            success: true, message: "funcionário criado com sucesso", data: user
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(responses.BAD_REQUEST).send({
                            code: 400, error: "invalid_insert", error_description: "erro ao inserir o dado na base"
                        })
                    })
            })
            .catch(err => console.log(err))
    },

    profile: (req, res, next) => {
        let profileId = req.user.id._id
        // let profileId = req.oauth.bearerToken.userId._id

        User.findById(profileId)
        .then(user => {
            let data = {
                name: user.name,
                email: user.email
            }
            // return res.status(responses.OK).json(data)
            return res.status(responses.OK).json(data)
        })
        .catch(err => {
            return res.status(responses.BAD_REQUEST)
        })
    },

    updateProfile: (req, res, next) => {
        
        let profileId = req.oauth.bearerToken.userId._id

        if (req.body.name == undefined ||
            req.body.email == undefined) {
            return res.status(responses.BAD_REQUEST).json({
                code: 400,
                error: "invalid_body_register",
                error_description: "username, password and name are required"
            });
        }

        //Atualizando dados do usuario filtrando pelo ID 
        User.findById(profileId)
        .then(user => {
            
            user.name = req.body.name

            let date = new Date()
            let hour = date.getHours() - 4
            let minutes = date.getMinutes()

            let parseHour = ("0" + hour).slice(-2)
            let parseMinut = ("0" + minutes).slice(-2)
            
            user.updates.push({
                date:  `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`,
                hour: `${parseHour}:${parseMinut}`
            })
            
            return user.save();
            
        })
        .then(usernew => {
            // console.log(usernew)
            return res.status(responses.OK).json({
                success: true,
                message: "registro atualizado com sucesso",
                data: usernew
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(responses.BAD_REQUEST).json({
                success: false,
                message: "não encontrei o usuário",
                data: ""
            })
        })
    },

    updatePassword: (req, res, next) => {

        let profileId = req.oauth.bearerToken.userId._id
        let currentPassword = req.body.currentPassword
        let newPassword = req.body.password

        if (newPassword == undefined) {
            return res.status(responses.BAD_REQUEST).json({
                code: 400,
                error: "invalid_body_register",
                error_description: "password are required"
            });
        }


        User.findById(profileId)
        .then(user => {
            bcrypt.compare(currentPassword, user.password)
            .then(response => {

                if (!response) {
                    return res.status(responses.BAD_REQUEST).json({
                        code: 400,
                        error: "invalid_password",
                        error_description: "password is invalid"
                    });
                }
                

                user.password = bcrypt.hashSync(newPassword, 5)
                return user.save();
            })
            .then(usernew => {
                // console.log(usernew)
                OAuth2Controller.logout(usernew)
                return res.status(responses.OK).json({
                    success: true,
                    message: "registro atualizado com sucesso",
                    data: usernew
                })
            })
            // user.password = bcrypt.hashSync(req.body.password, 5)
            // return user.save();
        })
        .catch(err => {
            console.log(err)
            return res.status(responses.OK).json({
                success: false,
                message: "não encontrei o usuário",
                data: ""
            })
        })
        
    }
    
}