const mongoose = require('mongoose');
const Report = require('../models/mReport');

// Read - GET all - find():
exports.getReports = async (req, res, next) => {
    Report.find()
    .then(reports => {
        res.status(200).json({reports: reports});
    })
    .catch(err => console.log(err));
};

// Read - GET by id - findById(id):
exports.getReportById = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Report ID format' });
    }
    Report.findById(id)
        .then(report => {
            if (!report) {
                res.status(404).json({ message: `Report ${id} not found` });
            }
            return res.status(200).json({ report: report });
        })
        .catch(err => console.log(err));
};

// Create - POST: create()
exports.createReport = (req, res, next) => {
    const UnitNo = req.body.unitno;
    const RepDate = req.body.repdate;
    const Location = req.body.location;
    const Status = req.body.status;
    const Description = req.body.description;
    Report.create({
        unitno: UnitNo,
        repdate: RepDate,
        location: Location,
        status: Status,
        description: Description
        })
        .then(result => {
            res.status(201).json({
                message: `Report successfully created.`,
                report: result
            });
            }
        )
        .catch(err => console.log(err));
};

// Update - PUT: set() and save()
exports.updateReport = (req, res, next) => {
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

    Report.findById(id)
        .then(report => {
            if (!report) {
                return res.status(404).json({ message: `Report ${id} not found!`});
            }
            report.set(updates);
            return report.save();
            })
            .then(result => {
                res.status(200).json({ message: `Report ${id} updated!`, report: result} );
            })
        .catch(err => console.log(err));
};

// Delete - DELETE: findByIdAndDelete()
exports.deleteReport = (req, res, next) => {
    const { id } = req.params;

    Report.findById(id)
        .then(report => {
            if (!report) {
                return res.status(404).json({ message: `Report ${id} not found!`});
            }
            return Report.findByIdAndDelete(id);
        })
        .then(result => {
            res.status(200).json({ message: `Report ${id} successfully deleted.`} );
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

// Automatically delete past visitors - DELETE: deleteMany()
exports.deletePastReports = async (req, res, next) => {
    try {
        // Cleaning up the reports that are completed but giving the admin 30 days
        // from the report date to review before permanent deletion
        // Set past 30 days to later detemine if the buffer period
        // has passed since the date of report
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - 30);

        // Delete only reports that are "Completed" AND reported before the end of the buffer
        const result = await Report.deleteMany({ 
            status: 'Completed',
            repdate: { $lte: dateThreshold }
        });

        res.status(200).json({ 
            message: `Cleanup successful. Deleted ${result.deletedCount} completed reports.` 
        });
    } catch (err) {
        console.error("Cleanup Error:", err);
        res.status(500).json({ error: err });
    }
};

// Read - GET by unitno - findOne({ unitno: '...' }):
// This function retrieves a unit's _id based on its unit number.
exports.getReportIdByNo = async (req, res, next) => {
    const { unitno } = req.params;

    // Use findOne to search for a report matching the unitno
    // We only select the _id field to return minimal data
    Report.findOne({ unitno: unitno })
        .select('_id')
        .then(report => {
            if (!report) {
                // If no report is found, return 404
                return res.status(404).json({ message: `Report with number ${unitno} not found` });
            }
            // Return the entire report object (which only contains the _id field)
            return res.status(200).json(report);
        })
        .catch(err => {
            console.error(err);
            // Handle database errors
            res.status(500).json({ message: 'Internal server error during report lookup' });
        });
};