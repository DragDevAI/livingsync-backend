const mongoose = require('mongoose');

const frSchema = new mongoose.Schema({
    unitno: String,
    playdate: Date,
}, { collection: 'function' });

const Function = mongoose.model('Function', frSchema);
module.exports = Function;