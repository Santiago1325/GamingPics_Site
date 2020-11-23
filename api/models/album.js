'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AlbumSchema = Schema({
    publication: {type: Schema.ObjectId, ref: 'Publication'},
    user: {type: Schema.ObjectId, ref: 'User'},
})

module.exports = mongoose.Schema("Album", AlbumSchema);