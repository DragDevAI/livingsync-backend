const mongoose = require('mongoose');
const fRoom = require('../models/mFunction');

// Read - GET all - find():
exports.getFunctions = async (req, res, next) => {
    fRoom.find()
    .then(functions => {
        res.status(200).json({functions: functions});
    })
    .catch(err => console.log(err));
};

// Read - GET by id - findById(id):
exports.getFunctionById = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Function ID format' });
    }
    fRoom.findById(id)
        .then(fRoom => {
            if (!fRoom) {
                res.status(404).json({ message: `Function ${id} not found` });
            }
            return res.status(200).json({ fRoom: fRoom });
        })
        .catch(err => console.log(err));
};

// Create - POST: create()
exports.createFunction = async (req, res, next) => {
    const UnitNo = req.body.unitno;
    const PlayDate = req.body.playdate;
    
    try {
        // Check existing bookings for this date
        // This query finds all bookings on the exact same timestamp.
        const count = await fRoom.countDocuments({ playdate: PlayDate });

        if (count >= 1) { // One function room only
            return res.status(400).json({ message: "Sorry, fully booked for this date." });
        }

        const result = await fRoom.create({
            unitno: UnitNo,
            playdate: PlayDate
        });

        res.status(201).json({
            message: `Function successfully created.`,
            fRoom: result
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    };
    
};

// Delete - DELETE: findByIdAndDelete()
exports.deleteFunction = (req, res, next) => {
    const { id } = req.params;

    fRoom.findById(id)
        .then(fRoom => {
            if (!fRoom) {
                return res.status(404).json({ message: `Function ${id} not found!`});
            }
            return fRoom.findByIdAndDelete(id);
        })
        .then(result => {
            res.status(200).json({ message: `Function ${id} successfully deleted.`} );
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

// Automatically delete past Function records where playdate is less than today - DELETE: deleteMany()
exports.deletePastFunctions = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Let's count how many it SHOULD delete before deleting
        const count = await fRoom.countDocuments({ playdate: { $lt: today } });

        // Delete all records where 'playdate' is Less Than ($lt) today
        const result = await fRoom.deleteMany({ playdate: { $lt: today } });

        res.status(200).json({ 
            message: `Cleanup successful. Deleted ${result.deletedCount} past Function records.` 
        });
    } catch (err) {
        console.error("Cleanup Error:", err);
        res.status(500).json({ error: err });
    }
};

// Read - GET by unitno - findOne({ unitno: '...' }):
// This function retrieves a function's _id based on its unit number.
exports.getFunctionIdByNo = async (req, res, next) => {
    const { unitno } = req.params;

    // Use findOne to search for a function matching the unitno
    // We only select the _id field to return minimal data
    fRoom.findOne({ unitno: unitno })
        .select('_id')
        .then(fRoom => {
            if (!fRoom) {
                // If no fRoom is found, return 404
                return res.status(404).json({ message: `Function with number ${unitno} not found` });
            }
            // Return the entire fRoom object (which only contains the _id field)
            return res.status(200).json(fRoom);
        })
        .catch(err => {
            console.error(err);
            // Handle database errors
            res.status(500).json({ message: 'Internal server error during Function lookup' });
        });
};