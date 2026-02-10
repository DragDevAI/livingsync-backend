const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Car = require('../models/mCar');
const Account = require('../models/mAccount'); 

// Configure Email Transporter (to send notice to user upon car registration approval/rejection)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// --- 2. Controller Functions ---
// Read - GET all
exports.getCars = (req, res, next) => {
    Car.find()
    .then(cars => res.status(200).json({cars: cars}))
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Error fetching cars" });
    });
};

// Read - Car by Unit
exports.getCarsByUnit = (req, res, next) => {
    const { unitno } = req.params;
    
    // Changed findOne -> find to get ALL cars
    // Removed .select('_id') to get full details immediately
    Car.find({ unitno: unitno }) 
        .then(cars => {
            // Return an empty array if none found, rather than 404, 
            // so the frontend can just show "No cars" without an error.
            return res.status(200).json({ cars: cars }); 
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error during car lookup' });
        });
};

// Create - POST
exports.createCar = async (req, res, next) => { // Changed to async
    const { unitno, plate } = req.body;

    if (!unitno || !plate) {
        return res.status(400).json({ message: 'Unit number and Plate number are required.' });
    }

    try {
        // 1. Check Limit (Max 2 cars per unit)
        const currentCarCount = await Car.countDocuments({ unitno: unitno });
        if (currentCarCount >= 2) {
            return res.status(400).json({ message: 'Maximum 2 vehicles allowed per unit.' });
        }

        // 2. Check duplicate plate
        const existingCar = await Car.findOne({ plate: plate });
        if (existingCar) {
            return res.status(409).json({ message: 'Car plate already registered.' });
        }

        // 3. Create
        const car = new Car({
            unitno: unitno,
            plate: plate,
            verified: false 
        });
        
        const result = await car.save();
        res.status(201).json({ message: 'Car registered successfully, pending verification!', car: result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error registering car.' });
    }
};

// Update - PUT (Approvals happen here)
exports.updateCar = async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Update request empty' });
    }
    // Clean up null/undefined
    for (const key in updates) {
        if (updates[key] === null || updates[key] === undefined) delete updates[key];
    }

    try {
        const car = await Car.findById(id);
        if (!car) return res.status(404).json({ message: `Car ${id} not found!`});

        // Check if we are APPROVING (Current is false, Update is true)
        const isApproving = car.verified === false && updates.verified === true;

        // Apply updates
        car.set(updates);
        const result = await car.save();

        // Send Email if Approved
        if (isApproving) {
            // Find owner email using unitno
            const owner = await Account.findOne({ unitno: result.unitno });
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: process.env.EMAIL,
                    subject: 'Vehicle Registration Approved',
                    text: `Dear ${owner.name},\n\nYour vehicle registration for plate ${result.plate} (Unit ${result.unitno}) has been APPROVED.\n\nRegards,\nManagement`
                });
                console.log(`Approval email sent to ${process.env.EMAIL}`);
            }
        res.status(200).json({ message: `Car ${id} updated!`, car: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating car.' });
    }
};

// Delete - DELETE (Rejections happen here)
exports.deleteCar = async (req, res, next) => {
    const { id } = req.params;

    try {
        // 1. Find the car first (so we can get details for the email)
        const car = await Car.findById(id);
        if (!car) return res.status(404).json({ message: `Car ${id} not found!`});

        // 2. Find the owner to get the email
        const owner = await Account.findOne({ unitno: car.unitno });

        // 3. Send Rejection Email
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: process.env.EMAIL,
                    subject: 'Vehicle Registration Update',
                    text: `Dear ${owner.name},\n\nYour vehicle registration request for plate ${car.plate} has not been sucessful.\n\nPlease contact management for details.`
                });
                console.log(`Rejection email sent to ${process.env.EMAIL}`);
            } catch (emailErr) {
                console.error("Failed to send rejection email:", emailErr);
                // Continue to delete even if email fails
            }

        // 4. Delete the document
        await Car.findByIdAndDelete(id);
        
        res.status(200).json({ message: `Car ${id} deleted and user notified!` });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error deleting car.' });
    }
}; 

/*
// Read - GET by ID
// Read - GET Single Car by ID (Missing Function)
exports.getCarByIdNo = (req, res, next) => {
    const { id } = req.params;
    
    // Validate if 'id' is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Car ID format' });
    }

    Car.findById(id)
        .then(car => {
            if (!car) return res.status(404).json({ message: `Car ${id} not found` });
            return res.status(200).json({ car: car });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error fetching car details' });
        });
};

// Read - GET by unitno (Helper)
exports.getCarIdByNo = (req, res, next) => {
    const { unitno } = req.params;
    Car.findOne({ unitno: unitno })
        .select('_id')
        .then(car => {
            if (!car) return res.status(404).json({ message: `Car with number ${unitno} not found` });
            return res.status(200).json(car);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error during car lookup' });
        });
};
*/