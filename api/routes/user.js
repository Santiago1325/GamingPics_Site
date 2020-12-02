'use strict'

let express = require('express');
let UserController = require('../controllers/user');
let multipart = require('connect-multiparty');
let mid_auth = require('../middlewares/auth');
let md_upload = multipart({uploadDir: './uploads/user'}) 
let api = express.Router()

api.get('/home', UserController.home);
api.get('/pruebas', mid_auth.validateAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUsers);
api.get('/user/:id', mid_auth.validateAuth, UserController.getUser);
api.get('/users/:page', mid_auth.validateAuth, UserController.getUsers);
api.put('/update-user/:id', mid_auth.validateAuth, UserController.updateUser);
api.post('/upload-image/:id', [mid_auth.validateAuth, md_upload], UserController.updateImage);



module.exports = api;
