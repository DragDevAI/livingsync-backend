const mongoose = require('mongoose');

const cSchema = new mongoose.Schema({
    unitno : String,
    plate : String,
    verified : { type: Boolean, default: false },
}, { collection: 'car' });

const Car = mongoose.model('Car', cSchema);
module.exports = Car;