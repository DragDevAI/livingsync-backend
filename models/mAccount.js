const mongoose = require('mongoose');

const aSchema = new mongoose.Schema({
    name : String,
    password : String,
    unitno : String,
    role : {
        type: String,
        enum: ['admin', 'owner', 'tenant'] // Enforce role values
    },
    verified : {
        type: Boolean,
        default: false
    },
}, { collection: 'account' });

const Account = mongoose.model('Account', aSchema);
module.exports = Account;