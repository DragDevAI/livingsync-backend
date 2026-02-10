const mongoose = require('mongoose');
const Unit = require('../models/mUnit');

// Read - GET all - find():
exports.getUnits = async (req, res, next) => {
    Unit.find()
    .then(units => {
        res.status(200).json({units: units});
    })
    .catch(err => console.log(err));
};

// Read - GET by id - findById(id):
exports.getUnitByIdNo = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Unit ID format' });
    }
    Unit.findById(id)
        .then(unit => {
            if (!unit) {
                res.status(404).json({ message: `Unit ${id} not found` });
            }
            return res.status(200).json({ unit: unit });
        })
        .catch(err => console.log(err));
};

// Read - GET by unitno - findOne({ unitno: '...' }):
// This function retrieves a unit's _id based on its unit number.
exports.getUnitIdByNo = async (req, res, next) => {
    const { unitno } = req.params;

    // Use findOne to search for a unit matching the unitno
    // We only select the _id field to return minimal data
    Unit.findOne({ unitno: unitno })
        .select('_id')
        .then(unit => {
            if (!unit) {
                // If no unit is found, return 404
                return res.status(404).json({ message: `Unit with number ${unitno} not found` });
            }
            // Return the entire unit object (which only contains the _id field)
            return res.status(200).json(unit);
        })
        .catch(err => {
            console.error(err);
            // Handle database errors
            res.status(500).json({ message: 'Internal server error during unit lookup' });
        });
};

// Information about unit apartments are fixed and will not be changed or deleted.
// Therefore, no Create, Update, or Delete operations are provided for units.