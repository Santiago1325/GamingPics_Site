'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let app = express();

//Rutas
let user_routes = require('./routes/user');
let pub_routes = require('./routes/publication');


//Middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//Cors

//Rutas
app.use('/api', user_routes);
app.use('/api', pub_routes);



module.exports = app;