const mongoose = require('mongoose');
const BBQ = require('../models/mBBQ');

// Read - GET all - find():
exports.getBBQs = async (req, res, next) => {
    BBQ.find()
    .then(bbqs => {
        res.status(200).json({bbqs: bbqs});
    })
    .catch(err => console.log(err));
};

// Read - GET by id - findById(id):
exports.getBBQById = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid BBQ ID format' });
    }
    BBQ.findById(id)
        .then(bbq => {
            if (!bbq) {
                res.status(404).json({ message: `BBQ ${id} not found` });
            }
            return res.status(200).json({ bbq: bbq });
        })
        .catch(err => console.log(err));
};

// Create - POST: create()
exports.createBBQ = async (req, res, next) => {
    const UnitNo = req.body.unitno;
    const BurnDate = req.body.burndate;
    const Deposit = req.body.deposit;
    
    try {
        // Check existing bookings for this date
        // This query finds all bookings on the exact same timestamp.
        const count = await BBQ.countDocuments({ burndate: BurnDate });

        if (count >= 1) { // Small condo, only one BBQ Pit
            return res.status(400).json({ message: "Sorry, fully booked for this date." });
        }

        const result = await BBQ.create({
            unitno: UnitNo,
            burndate: BurnDate,
            deposit: Deposit
        });

        res.status(201).json({
            message: `BBQ successfully created.`,
            bbq: result
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    };
    
};

// Delete - DELETE: findByIdAndDelete()
exports.deleteBBQ = (req, res, next) => {
    const { id } = req.params;

    BBQ.findById(id)
        .then(bbq => {
            if (!bbq) {
                return res.status(404).json({ message: `BBQ ${id} not found!`});
            }
            return BBQ.findByIdAndDelete(id);
        })
        .then(result => {
            res.status(200).json({ message: `BBQ ${id} successfully deleted.`} );
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

// Automatically delete past BBQ records where burndate is less than today - DELETE: deleteMany()
exports.deletePastBBQs = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Let's count how many it SHOULD delete before deleting
        const count = await BBQ.countDocuments({ burndate: { $lt: today } });

        // Delete all records where 'burndate' is Less Than ($lt) today
        const result = await BBQ.deleteMany({ burndate: { $lt: today } });

        res.status(200).json({ 
            message: `Cleanup successful. Deleted ${result.deletedCount} past BBQ records.` 
        });
    } catch (err) {
        console.error("Cleanup Error:", err);
        res.status(500).json({ error: err });
    }
};

// Read - GET by unitno - findOne({ unitno: '...' }):
// This function retrieves a bbq's _id based on its unit number.
exports.getBBQIdByNo = async (req, res, next) => {
    const { unitno } = req.params;

    // Use findOne to search for a bbq matching the unitno
    // We only select the _id field to return minimal data
    BBQ.findOne({ unitno: unitno })
        .select('_id')
        .then(bbq => {
            if (!bbq) {
                // If no bbq is found, return 404
                return res.status(404).json({ message: `BBQ with number ${unitno} not found` });
            }
            // Return the entire bbq object (which only contains the _id field)
            return res.status(200).json(bbq);
        })
        .catch(err => {
            console.error(err);
            // Handle database errors
            res.status(500).json({ message: 'Internal server error during BBQ lookup' });
        });
};