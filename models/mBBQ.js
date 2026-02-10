const mongoose = require('mongoose');

const bSchema = new mongoose.Schema({
    unitno: String,
    burndate: Date,
    deposit: { type: Boolean, default: true },
}, { collection: 'bbq' });

const BBQ = mongoose.model('BBQ', bSchema);
module.exports = BBQ;