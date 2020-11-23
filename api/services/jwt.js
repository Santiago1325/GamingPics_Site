'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret_key = "KillMePls"

function createToken(user){
    var payload = {
        sub: user._id,
        nombre: user.name,
        username: user.username,
        email: user.email,
        imagen: user.image,
        lat: moment().unix(),
        exp: moment().add(30, 'days').unix(),
    }

    return jwt.encode(payload, secret_key);
}


module.exports = {createToken}