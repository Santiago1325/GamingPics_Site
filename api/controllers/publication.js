'use strict'

let User = require('../models/user');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');
const publication = require('../models/publication');
let path = require('path');
let fs = require('fs');

function savePublication(req,res){
    let userID = req.params.id;
    let params = req.body;
    let pub = new publication();

    if(userID != req.user.sub){
        console.log(userID)
        console.log(req.user.sub)
        return res.status(500).send({
            message: "El usuario no tiene permisos"
        })
    }
    
    if(params.game){
        if(req.files){
            let file_path = req.files.image.path;
            let file_split = file_path.split('\\')
            let file_name = file_split[2];
            let file_ext = file_name.split('\.')[1];      
    
            if(file_ext == "png" | file_ext == "jpg" | file_ext == "gif" | file_ext == "svg"){
                pub.text = null
                params.tag = null
                pub.user = userID;
                pub.game = params.game;
                pub.image = file_name;
                let date = new Date();
                pub.created_at = date.toString();
            }else{
                fs.unlink(file_path, () => {
                    return res.status(200).send({
                        message: "Extension del archivo no es correcta"
                    })
                })
            }

            pub.save((err, pubStored) =>{
                if(err){
                    return res.status(500).send({
                        message: "Error al guardar"
                    });
                }

                if(pubStored){
                    return res.status(200).send({
                        message: "Publicacion almacenada",
                        pub: pubStored
                    })
                }else{
                    return res.status(400).send({
                        message: "Publicacion no almacenada"
                    })
                }
            })
        }else{
            return res.status(200).send({
                message:"Datos incompletos"
            })           
        }
    }else{
        return res.status(200).send({
            message:"Datos incompletos"
        })         
    }
}


function deletePublication(req, res){
    let userId = req.params.id;
    let params = req.body

    if(userId != req.user.sub){
        return res.status(500).send({
            message: "El usuario no tiene permisos"
        })
    }
    
    if(params.pubId){
        publication.findById(params.pubId, (err, pub) => {
            if(err){
                return res.status(500).send({
                    message: "Error en la peticion"
                })
            }

            if(!pub){
                return res.status(200).send({
                    message: "Publicacion no encontrada"
                })
            }

            if(pub.user == userId){
                publication.findByIdAndDelete(pub._id, (err, deleted) =>{
                    if(err){
                        return res.status(500).send({
                            message:"Error en la peticion"
                        })
                    }

                    if(deleted){
                        return res.status(200).send({
                            message: "Publicacion eliminada"
                        })
                    }
                })
            }else{
                return res.status(200).send({
                    message: "No es dueño de la publicacion"
                })
            }

        })

    }else{
        return res.status(200).send({
            message: "No existe la publicacion para borrar"
        })
    }

}

function updateText(req, res){
    let userID = req.params.id;
    let params = req.body

    if(userID != req.user.sub){
        return req.status(500).send({
            message: "El usuario no tiene permisos"
        })
    }    

    if(!params.text){
        return res.status(500).send({
            message:"Datos incompletos"
        })
    }


    publication.findById(params.pubId, (err, pub) => {
        if(err){
            return req.status(500).send({
                message:"Hubo un error en la peticion"
            })
        }

        if(!params.pubId){
            return req.status(200).send({
                message: "No se encontro la publicacion"
            })
        }

        if(pub.user == userID){
            publication.findByIdAndUpdate(params.pubId, {text: params.text}, {new:true}, (err, pubUpdated) => {
                if(err){
                    return res.status(500).send({
                        message: "Error en la peticion"
                    })
                }

                if(!pubUpdated){
                    return res.status(200).send({
                        message: "No se encontro la publicacion"
                    })
                }

                return res.status(200).send({
                    pubUpdated
                })

            })
        }



    })

}

function updateGame(req, res){
    let userID = req.params.id;
    let params = req.body

    if(userID != req.user.sub){
        return req.status(500).send({
            message: "El usuario no tiene permisos"
        })
    }    

    if(!params.game){
        return res.status(500).send({
            message: "Informacion incompleta"
        })
    }

    publication.findById(params.pubId, (err, pub) => {
        if(err){
            return req.status(500).send({
                message:"Hubo un error en la peticion"
            })
        }

        if(!params.pubId){
            return req.status(200).send({
                message: "No se encontro la publicacion"
            })
        }

        if(pub.user == userID){
            publication.findByIdAndUpdate(params.pubId, {game: params.game}, {new:true}, (err, pubUpdated) => {
                if(err){
                    return res.status(500).send({
                        message: "Error en la peticion"
                    })
                }

                if(!pubUpdated){
                    return res.status(200).send({
                        message: "No se encontro la publicacion"
                    })
                }

                return res.status(200).send({
                    pubUpdated
                })

            })
        }



    })
}

function getPub(req, res){
    let pubId = req.params.id
    publication.findById(pubId, (err, pub) =>{
        if(err){
            return res.status(500).send({
                message: "Error en la peticion"
            })
        }

        if(!pub){
            return res.status(200).send({
                message: "Publicacion no encontrada"
            })
        }

        return res.status(200).send({pub});
    })

}

function getPubs(req, res){
    let page = 1;
    if(req.params.page){
        page = req.params.page
    }

    let docsPerPage = 5;

    publication.find().sort('_id').paginate(page,docsPerPage,(err, pubs, total) =>{
        if(err){
            return res.status(500).send({
                message: "Error en la peticion"
            })
        }

        if(!pubs){
            return res.status(200).send({
                message: "No hay publicaciones"
            })
        }

        return res.status(200).send({pubs, total, pages: Math.ceil(total/docsPerPage)});
    })



}



module.exports = {
    savePublication, 
    deletePublication, 
    updateText,
    updateGame,
    getPub,
    getPubs
}