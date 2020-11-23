'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PublicationSchema = Schema({
    text: String,
    image: String,
    created_at: String,
    game: String,
    user: {type: Schema.ObjectId, ref: 'User'},
})

module.exports = mongoose.model("Publication", PublicationSchema);