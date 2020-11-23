'use strict'

let express = require('express');
let UserController = require('../controllers/user');

let mid_auth = require('../middlewares/auth');
let api = express.Router()

api.get('/home', UserController.home);
api.get('/pruebas', mid_auth.validateAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUsers);
api.get('/user/:id', mid_auth.validateAuth, UserController.getUser);
api.get('/users/:page', mid_auth.validateAuth, UserController.getUsers);
api.put('/update-user/:id', mid_auth.validateAuth, UserController.updateUser);



module.exports = api;
