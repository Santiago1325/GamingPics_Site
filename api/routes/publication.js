'use strict'

let express = require('express');
let PubController = require('../controllers/publication');
let multipart = require('connect-multiparty');
let mid_auth = require('../middlewares/auth');
let md_upload = multipart({uploadDir: './uploads/publications'}) 
let api = express.Router();

api.post('/makepost/:id', [mid_auth.validateAuth, md_upload], PubController.savePublication);
api.delete('/deletepost/:id', mid_auth.validateAuth, PubController.deletePublication);
api.put('/updatetext/:id', mid_auth.validateAuth, PubController.updateText);
api.put('/updategame/:id', mid_auth.validateAuth, PubController.updateGame);
api.get('/getpost/:id', PubController.getPub);
api.get('/getposts/:page', PubController.getPubs);


module.exports = api;