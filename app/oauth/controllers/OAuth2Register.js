// const OAuth2AccessToken = require('../models/OAuth2AdminAccessToken');
// const OAuth2Client = require('../models/OAuth2Client');
// const OAuth2UserAdmin = require('../models/OAuth2UserAdmin');
// const bcrypt = require('bcrypt');
// const JWT = require('jsonwebtoken');
// const basicauth = require('basic-auth');
// // var responses = require('../../../config/responses/Responses')

// var model = module.exports;


// model.registerUser = function (req, res, next) {
//     // console.log(req.headers['content-type'])
//     var client = basicauth(req);

//     if (client.name == "" || client.pass == "") {
//         return res.status(400).json({ code: 400, error: "invalid_basic_auth", error_description: "username and pass are required" });
//     }


//     OAuth2Client.findOne({ "client_id": client.name, "client_secret": client.pass }, function (err, OAuth2Client) {
//         if (!OAuth2Client) return res.status(400).json({ code: 400, error: "invalid_basic_auth", error_description: "credentials invalid" });

//         if (req.headers['content-type'] != "application/x-www-form-urlencoded") return res.status(400).json({ code: 400, error: "invalid_request", error_description: "Method must be POST with application/x-www-form-urlencoded encoding" });

//         if (
//             req.body.username == undefined ||
//             req.body.password == undefined ||
//             req.body.name == undefined) {
//             return res.status(400).json({ code: 400, error: "invalid_body_register", error_description: "username, password and name are required" });
//         }

//         OAuth2UserAdmin.findOne({ "username": req.body.username }, function (err, userApplication) {
//             if(userApplication) return res.status(400).json({code: 400, error:"username_invalid", error_description: "username is being used"});

//             var user = new OAuth2UserAdmin();
//             user.name = req.body.name;
//             user.username = req.body.username;
//             user.password = bcrypt.hashSync(req.body.password, 5);
           

//             user.save(function (err, userCreated)
//             {
//                 if(err) return res.status(400).json({code: 400, error:"failed_to_register", error_description: "it was not possible to register the user"}); 

//                 return res.status(201).json({success: true, message: "created user", user: userCreated});
//             })

//         })


//     })
// }



