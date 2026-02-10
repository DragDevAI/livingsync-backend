const mongoose = require('mongoose');

const vSchema = new mongoose.Schema({
    unitno: String,
    paxnum: Number,
    visitdate: Date,
    drives: {
        type: Boolean,
        required: true,
        default: false
    },
    carPlate: {
        type: String,
        required: function () {
            return this.drives === true; // Conditional validation: carPlate is required if drives is true
        },
        default: null
    },
}, { collection: 'visitor' });

// Data cleanup before saving
vSchema.pre('save', async function () {
    if (!this.drives) {
        this.carPlate = null; // Clear carPlate if drives is false
    }
});

const Visitor = mongoose.model('Visitor', vSchema);
module.exports = Visitor;