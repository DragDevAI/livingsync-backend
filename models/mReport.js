const mongoose = require('mongoose');

const repSchema = new mongoose.Schema({
    unitno : String,
    repdate : Date, // Report date
    location : String,
    status : {
        type: String,
        enum: ['Received', 'In Progress', 'Completed'], // Enforce status values
        default: 'Received'
    },
    description: {
        type: String,
        // Enforce the rule so that user won't submit an empty description
        required: [true, 'A description of the issue is required'], 
        validate: {
            validator: function(v) {
                // Return true if empty (handled by 'required') or if word count <= 150
                if (!v) return true;
                
                // Trim whitespace and split by any whitespace character (space, tab, newline)
                const wordCount = v.trim().split(/\s+/).length;
                return wordCount <= 150;
            },
            message: props => `Description exceeds word limit of 150: In total ${props.value.trim().split(/\s+/).length} words.`
        }
    }
}, { collection: 'report' });

const Report = mongoose.model('Report', repSchema);
module.exports = Report;