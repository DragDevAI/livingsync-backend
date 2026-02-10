const mongoose = require('mongoose');

const uSchema = new mongoose.Schema({
    unitno : String,
    share : String,
    size : String,
    block : String,
    floor : String,
    bedroom : String,
}, { collection: 'unit' });

const Unit = mongoose.model('Unit', uSchema);
module.exports = Unit;