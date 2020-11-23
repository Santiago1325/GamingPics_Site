'use strict'

let mongoose = require('mongoose');
let app = require('./app');
let port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Proyecto', 
    {useMongoClient:true})
    .then(() => {
        console.log("La conexion se realizo correctamente")
        app.listen(port, () => {
            console.log("Servidor fue creado correctamente y se esta corriendo en http://localhost:3800");
        })
    })
    .catch(() => console.log(err));
