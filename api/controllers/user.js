'use strict'

let bcrypt = require('bcrypt-node');
const {param} = require('../app');
const user = require('../models/user');
let User = require('../models/user');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');
let path = require('path');
let fs = require('fs');

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
                                    return res.status(200).send({
                                        message: "Usuario almacenado",
                                        user: userStored
                                    })
                                }else{
                                    return res.status(404).send({
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

function updateImage(req, res){
    let userId = req.params.id;
    
    if(userId != req.user.sub){
        return res.status(500).send({
            message: "El usuario no tiene permisos"
        })
    }

    if(req.files){
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\')
        console.log(file_split)
        let file_name = file_split[2];
        let file_ext = file_name.split('\.')[1];
        console.log(file_ext)

        if(file_ext == "png" | file_ext == "jpg" | file_ext == "gif" | file_ext == "svg"){
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdate) =>{
                if(err){
                    return res.status(500).send({
                        message: "Error al actualizar"
                    })
                }

                if(!userUpdate){
                    return res.status(200).send({
                        message: "No se encontro el usuario"
                    })
                }

                return res.status(200).send({
                    message: "La imagen fue actualizada", userUpdate
                })
            })


        }else{
            fs.unlink(file_path, () => {
                return res.status(200).send({
                    message: "Extension del archivo no es correcta"
                })
            })
        }
    }else{
        res.status(200).send({
            message:"No hay archivos"
        })
    }
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUsers,
    getUser,
    getUsers,
    updateUser,
    updateImage
}