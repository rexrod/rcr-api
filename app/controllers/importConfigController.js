const fs = require('fs');
const path = require('path')
const clients = require('../config/import.json');
const OAuth2Client = require('../oauth/models/OAuth2Client')
const responses = require('../config/responses/responses')

module.exports = {
  importClients: (req, res, next) => {
    if(clients.status == false){
        
        OAuth2Client.insertMany(clients.clients)
        .then(docs => {
            return res.status(responses.CREATED).json({
                success: true,
                message: "registros inseridos com sucesso",
                data: docs
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(responses.BAD_REQUEST).json({
                code: 400,
                error: "invalid_insert",
                error_description: "error when saving oauthclients"
            });
        })
        
        
        clients.status = true;
        fs.writeFileSync(path.join(__dirname,'../config', 'import.json'), JSON.stringify(clients));

    }else{
        return res.status(responses.BAD_REQUEST).json({
            code: 400,
            error: "invalid_insert",
            error_description: "error when saving oauthclients, you already saved clients"
        });
    }

  }
}