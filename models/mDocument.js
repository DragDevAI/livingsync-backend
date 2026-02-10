const mongoose = require('mongoose');

const dSchema = new mongoose.Schema({
    
    title : String,
    description : String,
    docType: {
        type: String,
        enum: ['AGM Minute', 'Council Meeting Minute']
    },
    mimeType : String,
    url : String,

}, { collection: 'document' });

const Document = mongoose.model('Document', dSchema);
module.exports = Document;