'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = Schema({
    publication: {type: Schema.ObjectId, ref: 'Publication'},
    user: {type: Schema.ObjectId, ref: 'User'},
    content: String
})

module.exports = mongoose.Schema("Comment", CommentSchema);