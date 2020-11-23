'use strict'

let bcrypt = require('bcrypt-node');
const {param} = require('../app');
const user = require('../models/user');
let User = require('../models/user');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');

function home(req, res){
    res.status(200).send(
        {saludo: "Hola gonorreas"}
    )
}

function pruebas(req, res){
    res.status(200).send(
        {saludo: "Hola xd"}    
    )

}

function saveUser(req, res){
    let params = req.body;
    let user = new User();
    
    if(params.name && params.email && params.username && params.password){
        user.name = params.name
        user.email = params.email
        user.username = params.username
        user.image = null;
        user.description = null;

        User.find(
            {$or:[{email: user.email.toLowerCase()}, {username: user.username.toLowerCase()}]
            }).exec((err,users) => {
                if(err){
                    return res.status(500).send({
                        message: "Error en la peticion"
                    })
                }

                if(users && users.length >= 1){
                    return res.status(200).send({
                        message: "El usuario ya esta registrado"
                    })
                }else{
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        if(err){
                            console.log("Error encriptando");
                        }else{         
                            user.password = hash
                            user.save((err, userStored) => {
                                if(err){
                                    return res.status(500).send({
                                        message: "Error al guardar"
                                    });
                                }
                                if(userStored){
                                    res.status(200).send({
                                        message: "Usuario almacenado",
                                        user: userStored
                                    })
                                }else{
                                    res.status(404).send({
                                        message: "El usuario no fue almacenado"
                                    })
                                }
                            })
                        }
                    });
                }

            })
    }else{
        res.status(200).send({
            message: "Datos incompletos"
        })
    }
}

function loginUsers(req, res){
    let params = req.body;
    if(params.email){
        let email = params.email;
        let password = params.password;
        User.findOne({email:email}, (err, user) => {
            if(err){return res.status(500).send({message:"Hubo un error xd"})}
            if(user){
                bcrypt.compare(password, user.password, (err, check) => {
                    if(err){
                        return res.status(500).send({message: "No se pudo xd"});
                    }
                    if(check){
                        if(params.gettoken){
                            user.password = undefined;
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }else{
                            user.password = undefined;
                            return res.status(200).send({user});
                        }
                        
    
                    }else{
                        return res.status(200).send({message:"El usuario no esta registrado."})
                    }
                })
    
            }
        });

    }else{
        return res.status(200).send({message: "Datos incompletos"})
    }

}

function getUser(req, res){
    let userID = req.param.id
    User.findById(userID, (err, user) =>{
        if(err){
            return res.status(500).send({
                message: "Error en la peticion"
            })
        }
        if(!user){
            return res.status(200).send({
                message: "Usuario no encontrado"
            })
        }

        return res.status(200).send({user})
    })
}

function getUsers(req, res){
    let page = 1;
    if(req.params.page){
        page = req.param.page
    }

    let docsPerPage = 5;

    User.find().sort('_id').paginate(page, docsPerPage, (err, users, total) =>{
        if(err){
            return res.status(500).send({
                message: "Hubo un error consultando"
            })
        }

        if(!users){
            return res.status(200).send({
                message: "No hay usuarios"
            })
        }

        return res.status(200).send({users, total, pages: Math.ceil(total/docsPerPage)});

    })
}

function updateUser(req, res){
    let userID = req.params.id;
    let userUpdate = req.body;

    delete userUpdate.password;

    if(userID != req.user.sub){
        return req.status(500).send({
            message: "El usuario no tiene permisos"
        })
    }

    User.findByIdAndUpdate(userID, userUpdate, {new:true} ,(err, userUpdate) => {
        if(err){
            return res.status(500).send({
                message: "Error en la actualizacion"
            })
        }

        if(!userUpdate){
            return res.status(500).send({
                message: "No fueron enviados datos"
            })
        }
    })

    return res.status(200).send({
        userUpdate
    })

}



module.exports = {
    home,
    pruebas,
    saveUser,
    loginUsers,
    getUser,
    getUsers,
    updateUser
}