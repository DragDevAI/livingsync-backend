const mongoose = require('mongoose');
const Visitor = require('../models/mVisitor');

// Read - GET all - find():
exports.getVisitors = async (req, res, next) => {
    Visitor.find()
    .then(visitors => {
        res.status(200).json({visitors: visitors});
    })
    .catch(err => console.log(err));
};

// Read - GET by id - findById(id):
exports.getVisitorById = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Visitor ID format' });
    }
    Visitor.findById(id)
        .then(visitor => {
            if (!visitor) {
                res.status(404).json({ message: `Visitor ${id} not found` });
            }
            return res.status(200).json({ visitor: visitor });
        })
        .catch(err => console.log(err));
};

// Create - POST: create()
exports.createVisitor = (req, res, next) => {
    const UnitNo = req.body.unitno;
    const PaxNum = req.body.paxnum;
    const VisitDate = req.body.visitdate;
    const Drives = req.body.drives;
    const CarPlate = req.body.carPlate;
    Visitor.create({
        unitno: UnitNo,
        paxnum: PaxNum,
        visitdate: VisitDate,
        drives: Drives,
        carPlate: CarPlate
        })
        .then(result => {
            res.status(201).json({
                message: `Visitor successfully created.`,
                visitor: result
            });
            }
        )
        .catch(err => console.log(err));
};

// Update - PUT: set() and save()
exports.updateVisitor = (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    // Checking to make sure at least one field to update
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Update request empty' });
    };
    // Clean up and remove properties with 'null' or 'undefined' values from update object
    for (const key in updates) {
        if (updates[key] === null || updates[key] === undefined) {
            delete updates[key];
        };
    };

    Visitor.findById(id)
        .then(visitor => {
            if (!visitor) {
                return res.status(404).json({ message: `Visitor ${id} not found!`});
            }
            visitor.set(updates);
            return visitor.save();
            })
            .then(result => {
                res.status(200).json({ message: `Visitor ${id} updated!`, visitor: result} );
            })
        .catch(err => console.log(err));
};

// Delete - DELETE: findByIdAndDelete()
exports.deleteVisitor = (req, res, next) => {
    const { id } = req.params;

    Visitor.findById(id)
        .then(visitor => {
            if (!visitor) {
                return res.status(404).json({ message: `Visitor ${id} not found!`});
            }
            return Visitor.findByIdAndDelete(id);
        })
        .then(result => {
            res.status(200).json({ message: `Visitor ${id} successfully deleted.`} );
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

// Automatically delete past visitors - DELETE: deleteMany()
exports.deletePastVisitors = async (req, res, next) => {
    try {
        // Create a date object for "Start of Today" (00:00:00)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Delete all records where 'visitdate' is Less Than ($lt) today
        const result = await Visitor.deleteMany({ visitdate: { $lt: today } });

        res.status(200).json({ 
            message: `Cleanup successful. Deleted ${result.deletedCount} past visitor records.` 
        });
    } catch (err) {
        console.error("Cleanup Error:", err);
        res.status(500).json({ error: err });
    }
};

// Read - GET by unitno - findOne({ unitno: '...' }):
// This function retrieves a unit's _id based on its unit number.
exports.getVisitorIdByNo = async (req, res, next) => {
    const { unitno } = req.params;

    // Use findOne to search for a visitor matching the unitno
    // We only select the _id field to return minimal data
    Visitor.findOne({ unitno: unitno })
        .select('_id')
        .then(visitor => {
            if (!visitor) {
                // If no visitor is found, return 404
                return res.status(404).json({ message: `Visitor with number ${unitno} not found` });
            }
            // Return the entire visitor object (which only contains the _id field)
            return res.status(200).json(visitor);
        })
        .catch(err => {
            console.error(err);
            // Handle database errors
            res.status(500).json({ message: 'Internal server error during visitor lookup' });
        });
};