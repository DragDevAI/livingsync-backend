const mongoose = require('mongoose');

const renSchema = new mongoose.Schema({
    unitno : String,
    refromdate : Date, // Renovation commencement date
    retodate : Date, // Renovation end date
    conname : String, // Contractor name
    contelcontact : String, // Contractor telephone contact
    conemailcontact : String, // Contractor email contact
    deposit: { type: Boolean, default: true },
    hacking: {
        type: Boolean,
        required: true,
        default: false
    },
    hackDate: {
        type: String,
        required: function () {
            return this.hacking === true; // Conditional validation: hackDate is required if hacking is true
        },
        default: null
    },
}, { collection: 'renovation' });

const Renovation = mongoose.model('Renovation', renSchema);
module.exports = Renovation;