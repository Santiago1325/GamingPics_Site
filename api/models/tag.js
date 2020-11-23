'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TagSchema = Schema({
    type: String
})

module.exports = mongoose.Schema("Tag", TagSchema);