const splitByWhitespace = require("string-split-by-whitespace")
const bcrypt = require('bcrypt')
const basicauth = require('basic-auth')
const fs = require('fs')
const path = require('path')

const responses = require('../config/responses/responses')

const PushNotificationController = require('./notificationController')
const Employee = require('../models/EmployeeSchema')
// const avatarsJson = require('../config/avatarRef')

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


                //Verifica se algum campo passado nao consta como undefined
                if (req.body.name == undefined || req.body.email == undefined || req.body.department == undefined ||
                    req.body.cellphone == undefined || req.body.password == undefined || req.body.registration == undefined) {

                    return res.status(responses.BAD_REQUEST).json({
                        code: responses.BAD_REQUEST,
                        error: "invalid_body_register",
                        error_description: "name, username, password, department, cellphone and registratin are required"
                    })
                }


                //Verifica se ja existe um usuario cadastrado na base de dados via o email repassado na requisicao
                Employee.findOne({"email" : req.body.email})
                    .then(employee => {

                        //Se o usuario foi encontrado, retorna um erro informado que ja existe cadastro
                        if (employee){
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
                                error_description: "you need a org email"
                            })
                        }
                        
                        //separa cada nome do nome completo do usuario
                        let namelower = req.body.name.toLowerCase()
                        let namesplit = namelower.split(' ')
                        let namecount = namesplit.length
                    
                        //Cria um novo usuario com base no Schema de Employee
                        let employeedb = new Employee(req.body)
                        employeedb.password = bcrypt.hashSync(req.body.password, 5)
                    
                        let metadata = {
                            name: {
                                firstname: namesplit[0],
                                lastname: namesplit[(namecount - 1)],
                                keys: namesplit
                            }
                        }
                    
                        employeedb.metadata = metadata
                        
                        //save avatar
                        // employeedb.img = avatarsJson[2].path
                        
                        //Salva o novo Usuario na base de dados
                        return employeedb.save()
                    })
                    .then(employee => {
                        return res.status(responses.CREATED).json({
                            success: true, message: "funcionário criado com sucesso", data: employee
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

        Employee.findById(profileId)
        .then(employee => {
            let data = {
                name: employee.name,
                email: employee.email,
                department: employee.department,
                cellphone: employee.cellphone,
                firebase: employee.firebase
            }
            // console.log(data)
            // return res.status(responses.OK).json(data)
            return res.status(responses.OK).json(employee)
        })
        .catch(err => {
            return res.status(responses.BAD_REQUEST)
        })
        // console.log(Employee)
    },

    updateProfile: (req, res, next) => {        
        
        let profileId = req.oauth.bearerToken.userId._id

        if (req.body.name == undefined ||
            req.body.email == undefined ||
            req.body.department == undefined ||
            req.body.registration == undefined ||
            req.body.cellphone == undefined) {
            return res.status(responses.BAD_REQUEST).json({
                code: 400,
                error: "invalid_body_register",
                error_description: "username, password and name are required"
            });
        }

        
        Employee.findById(profileId)
        .then(employee => {
            
            employee.name = req.body.name
            employee.department = req.body.department
            employee.cellphone = req.body.cellphone
            employee.registration = req.body.registration
            employee.img = req.body.img
            employee.support = req.body.support
            // employee.email = req.body.email
            // if (req.file) { //req.file armazena os dados da imagem parsiada pelo multer

            //     const imageUrl = req.file.path  
            //     //Falta incluir no input que carrega a imagem o atributo enctype="multipart/form-data" para o multer conseguir parsiar a imagem
    
            //     if (!employee.img) {
            //         employee.img =  imageUrl
            //     } else {
            //         if (employee.img != imageUrl) {
            //             let pathImagesFolder = path.join(__dirname,'../..', employee.img)
            //             // console.log(pathImagesFolder)
            //             fs.unlink(pathImagesFolder, (err) => {
            //                 console.log(err)
            //             })
            //             employee.img = imageUrl
            //         }
            //     }
            // }


            //separa cada nome do nome completo do usuario
            let namesplit = splitByWhitespace(req.body.name.toLowerCase())
            let namecount = namesplit.length

            let metadata = {
                name: {
                    firstname: namesplit[0],
                    lastname: namesplit[(namecount - 1)],
                    keys: namesplit
                }
            }
            
            employee.metadata = metadata
            
            return employee.save();
            
        })
        .then(employeenew => {
            // console.log(employeenew)
            return res.status(responses.OK).json({
                success: true,
                message: "registro atualizado com sucesso",
                data: employeenew
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


        Employee.findById(profileId)
        .then(employee => {
            bcrypt.compare(currentPassword, employee.password)
            .then(response => {

                if (!response) {
                    return res.status(responses.BAD_REQUEST).json({
                        code: 400,
                        error: "invalid_password",
                        error_description: "password is invalid"
                    });
                }
                

                employee.password = bcrypt.hashSync(newPassword, 5)
                return employee.save();
            })
            .then(employeenew => {
                // console.log(employeenew)
                OAuth2Controller.logout(employeenew)
                return res.status(responses.OK).json({
                    success: true,
                    message: "registro atualizado com sucesso",
                    data: employeenew
                })
            })
            // employee.password = bcrypt.hashSync(req.body.password, 5)
            // return employee.save();
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


