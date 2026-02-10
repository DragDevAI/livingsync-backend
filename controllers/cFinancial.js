const mongoose = require('mongoose');
const Financial = require('../models/mFinancial');

// Read - GET all - find():
exports.getFinancials = async (req, res, next) => {
    Financial.find()
    .then(financials => {
        res.status(200).json({financials: financials});
    })
    .catch(err => console.log(err));
};

// Read - Financial id - findById(id):
exports.getFinancialByIdNo = (req, res, next) => {
    const { id } = req.params;

    // Validate (MongoDB) ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Financial ID format' });
    }
    Financial.findById(id)
        .then(financial => {
            if (!financial) {
                res.status(404).json({ message: `Financial ${id} not found` });
            }
            return res.status(200).json({ financial: financial });
        })
        .catch(err => console.log(err));
};

// Update - PUT: set() and save()
exports.updateFinancial = async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Update request empty' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Financial ID format' });
    }

    try {
        // Use findByIdAndUpdate with new:true to get the updated doc immediately
        const result = await Financial.findByIdAndUpdate(id, updates, { new: true });

        if (!result) {
            console.log(`[Backend] Financial ID ${id} not found.`);
            return res.status(404).json({ message: `Financial Record ${id} not found!` });
        }

        res.status(200).json({ 
            message: `Financial ${id} updated successfully!`, 
            financial: result 
        });

    } catch (err) {
        console.error("[Backend] Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Read - GET by unitno - findOne({ unitno: '...' }):
// This function retrieves a Financial's _id based on its unit number.
exports.getFinancialIdByNo = async (req, res, next) => {
    const { unitno } = req.params;

    // Use findOne to search for a financial matching the unitno
    // We only select the _id field to return minimal data
    Financial.findOne({ unitno: unitno })
        .select('_id')
        .then(financial => {
            if (!financial) {
                // If no financial is found, return 404
                return res.status(404).json({ message: `Financial with number ${unitno} not found` });
            }
            // Return the entire financial object (which only contains the _id field)
            return res.status(200).json(financial);
        })
        .catch(err => {
            console.error(err);
            // Handle database errors
            res.status(500).json({ message: 'Internal server error during financial lookup' });
        });
};