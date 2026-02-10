const mongoose = require('mongoose');
const Renovation = require('../models/mRenovation');

// Read - GET all - find():
exports.getRenovations = async (req, res, next) => {
    Renovation.find()
    .then(renovations => {
        res.status(200).json({renovations: renovations});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Error fetching renovations" });
    });
};

// Read - GET by unitno - findOne({ unitno: '...' }):
exports.getRenovationsByUnit = (req, res, next) => {
    const { unitno } = req.params;

    Renovation.find({ unitno: unitno })
        .then(renovations => {
            // Return empty array instead of 404 if none found (better for frontend)
            return res.status(200).json({ renovations: renovations });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error during lookup' });
        });
};

// Read - GET by id - findById(id):
exports.getRenovationById = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Renovation ID format' });
    }
    Renovation.findById(id)
        .then(renovation => {
            if (!renovation) {
                return res.status(404).json({ message: `Renovation ${id} not found` });
            }
            return res.status(200).json({ renovation: renovation });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error fetching renovation by ID" });
        });
};

// Create - POST: create()
exports.createRenovation = async (req, res, next) => {

    const { 
        unitno, 
        refromdate, 
        retodate, 
        conname, 
        contelcontact, 
        conemailcontact, 
        hacking, 
        hackDate 
    } = req.body;
    
    // Basic validation
    if (!unitno || !refromdate || !retodate) {
        return res.status(400).json({ message: "Unit No, Start Date and End Date are required." });
    }

    try {
        const result = await Renovation.create({
            unitno: unitno,
            refromdate: refromdate,
            retodate: retodate,
            conname: conname,
            contelcontact: contelcontact,
            conemailcontact: conemailcontact,
            deposit: true, // Defaults to true per your schema
            hacking: hacking || false, // Default false if undefined
            hackDate: hackDate || null
        });

        res.status(201).json({
            message: `Renovation application submitted successfully.`,
            renovation: result
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating renovation", error: err.message });
    };
};

// Delete - DELETE: findByIdAndDelete()
exports.deleteRenovation = (req, res, next) => {
    const { id } = req.params;

    Renovation.findByIdAndDelete(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: `Renovation ${id} not found!`});
            }
            res.status(200).json({ message: `Renovation successfully deleted.`} );
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

// Automatically delete past Renovation records where retodate is less than today - DELETE: deleteMany()
exports.deletePastRenovations = async (req, res, next) => {
    try {
        const today = new Date();
        // Set to midnight to ensure we only delete things strictly in the past
        today.setHours(0, 0, 0, 0);

        // Delete records where 'retodate' is Less Than ($lt) today
        const result = await Renovation.deleteMany({ retodate: { $lt: today } });

        res.status(200).json({ 
            message: `Cleanup successful. Deleted ${result.deletedCount} past Renovation records.` 
        });
    } catch (err) {
        console.error("Cleanup Error:", err);
        res.status(500).json({ error: err });
    }
};

// Read - GET by unitno - findOne({ unitno: '...' }):
// This function retrieves a renovation's _id based on its unit number.
exports.getRenovationIdByNo = async (req, res, next) => {
    const { unitno } = req.params;

    // Use findOne to search for a renovation matching the unitno
    // We only select the _id field to return minimal data
    Renovation.findOne({ unitno: unitno })
        .select('_id')
        .then(renovation => {
            if (!renovation) {
                // If no renovation is found, return 404
                return res.status(404).json({ message: `Renovation with number ${unitno} not found` });
            }
            // Return the entire renovation object (which only contains the _id field)
            return res.status(200).json(renovation);
        })
        .catch(err => {
            console.error(err);
            // Handle database errors
            res.status(500).json({ message: 'Internal server error during Renovation lookup' });
        });
};