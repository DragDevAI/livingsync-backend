const mongoose = require('mongoose');
const Document = require('../models/mDocument');

// Read - GET all - find():
exports.getDocuments = async (req, res, next) => {
    Document.find()
    .then(documents => {
        res.status(200).json({documents: documents});
    })
    .catch(err => console.log(err));
};

// The documents are fixed and cannot be created, updated or deleted.