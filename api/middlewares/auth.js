'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret_key = "KillMePls"

function validateAuth(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "Se necesita enviar el token"
        })
    }
    let token = req.headers.authorization.replace(/['"]+/g, '')
    try{
        var payload = jwt.decode(token, secret_key);
        if(payload.exp <= moment().unix){
            return res.status(401).send({message: "El token expiro"})
        }
    }catch{
        return res.status(404).send({message: "El token no es valido"})
    }

    req.user = payload;
    next()
}

module.exports = {validateAuth}