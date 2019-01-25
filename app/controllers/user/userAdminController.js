const bcrypt = require('bcrypt')
const basicauth = require('basic-auth')

const responses = require('../../config/responses/responses')

//CRUD do usuario do sistema

const User = require('../../models/UserSchema')

const OAuth2Controller = require('../../oauth/controllers/OAuth2Controller')
const OAuth2Client = require('../../oauth/models/OAuth2Client')


exports.getProfile = (req, res, next) => {
    // let profileId = req.user.id._id
    // let profileId = req.oauth.bearerToken.userId._id

    let profileId = req.params.id || req.user.id._id

    User.findById(profileId)
    .then(user => {
        console.log(user)
        let data = {
            id: user._id,
            name: user.name,
            email: user.email,
            registration: user.registration,
            status: user.status
        }
        // return res.status(responses.OK).json(data)
        return res.status(responses.OK).json(data)
    })
    .catch(err => {
        return res.status(responses.BAD_REQUEST)
    })
},

exports.loadingProfiles = (req, res, next) => {
    User.find()
    .then(users => {
        // console.log(users)
        let profiles = []

        users.forEach(user => {
            let data = {
                id: user._id,
                name: user.name,
                email: user.email,
                registration: user.registration,
                status: user.status
            }
            profiles.push(data)
        })
        return profiles
    })
    .then(profiles => {
        return res.status(responses.OK).json(profiles)
    })
},

exports.updateProfile = (req, res, next) => {
    
    // let profileId = req.oauth.bearerToken.userId._id
    let profileId = req.params.id

    if (req.body.name == undefined ||
        req.body.email == undefined ||
        req.body.registration == undefined) {
        return res.status(responses.BAD_REQUEST).json({
            code: 400,
            error: "invalid_body_register",
            error_description: "name, email and registration are required"
        });
    }

    //Atualizando dados do usuario filtrando pelo ID 
    User.findById(profileId)
    .then(user => {
        
        user.name = req.body.name
        user.email = req.body.email
        user.registration = req.body.registration

        let date = new Date()
        let hour = date.getHours() - 4
        let minutes = date.getMinutes()

        let parseHour = ("0" + hour).slice(-2)
        let parseMinut = ("0" + minutes).slice(-2)
        
        user.updates.push({
            date:  `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`,
            hour: `${parseHour}:${parseMinut}`,
            changes: 'update basic informations, name, email and registration'
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

exports.updatePassword = (req, res, next) => {

    // let profileId = req.oauth.bearerToken.userId._id
    let profileId = req.params.id
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

            let date = new Date()
            let hour = date.getHours() - 4
            let minutes = date.getMinutes()

            let parseHour = ("0" + hour).slice(-2)
            let parseMinut = ("0" + minutes).slice(-2)
            
            user.updates.push({
                date:  `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`,
                hour: `${parseHour}:${parseMinut}`,
                changes: 'update password'
            })

            return user.save();
        })
        .then(usernew => {
            // console.log(usernew)
            OAuth2Controller.logout(usernew)
            return res.status(responses.OK).json({
                success: true,
                message: "senha atualizada com sucesso",
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
    
},

exports.deleteProfile = (req, res, next) => {
    let profileId = req.params.id
    let logedProfileId = req.oauth.bearerToken.userId._id

    if (profileId == logedProfileId) {
        return res.status(400).json({
            code: 400, error: "invalid_insert", error_description: "esse methodo so remove outros usuarios, use o autoDelete"
        })
    }

    User.findByIdAndRemove(profileId)
    .then(user => {
        if (user == null) {
            return res.status(400).json({
                code: 400, error: "invalid_insert", error_description: "dados ja removido ou nao existentes na base de dados"
            })
        }

        return res.status(200).json({
            success: true, message: 'usuario removido com sucesso', data: user
        })
    })
    .catch(err => {
        console.log(err.message)
        return res.status(400).json({
            code: 400, error: "invalid_insert", error_description: "erro ao carregar dados da base / dados nao encontrados"
        })
    })
},

exports.updateStatus = (req, res, next) => {
    let userId = req.params.id

    User.findById(userId)
    .then(user => {
        if (!user.status) {
            user.status = true

            let date = new Date()
            let hour = date.getHours() - 4
            let minutes = date.getMinutes()

            let parseHour = ("0" + hour).slice(-2)
            let parseMinut = ("0" + minutes).slice(-2)
            
            user.updates.push({
                date:  `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`,
                hour: `${parseHour}:${parseMinut}`,
                changes: 'set status false to true'
            })

            user.save()
            .then(result => {
                return res.status(200).json({
                    success: true,
                    message: "registro atualizado com sucesso",
                    data: result 
                })
            })
        } else {
            user.status = false

            let date = new Date()
            let hour = date.getHours() - 4
            let minutes = date.getMinutes()

            let parseHour = ("0" + hour).slice(-2)
            let parseMinut = ("0" + minutes).slice(-2)
            
            user.updates.push({
                date:  `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`,
                hour: `${parseHour}:${parseMinut}`,
                changes: 'set status true to false'
            })

            user.save()
            .then(result => {
                return res.status(200).json({
                    success: true,
                    message: "registro atualizado com sucesso",
                    data: result 
                })
            })
        }
    })
    .catch(err => {
        return res.status(responses.BAD_REQUEST).json({
            success: false,
            message: err,
            data: ""
        })
    })
}

