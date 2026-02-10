const mongoose = require('mongoose');

const fSchema = new mongoose.Schema({
    unitno : String,
    monthly : Number,
    outstanding : Number,
}, { collection: 'financial' });

const Financial = mongoose.model('Financial', fSchema);
module.exports = Financial;