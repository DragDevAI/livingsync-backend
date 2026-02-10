const mongoose = require('mongoose');
const Account = require('../models/mAccount');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Read - GET all - find():
exports.getAccounts = async (req, res, next) => {
    Account.find()
    .then(accounts => {
        res.status(200).json({accounts: accounts});
    })
    .catch(err => console.log(err));
};

// Read - GET by id - findById(id):
exports.getAccountByIdNo = (req, res, next) => {
    const { id } = req.params;
    // Validate (MongoDB) ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Account ID format' });
    }
    Account.findById(id)
        .then(account => {
            if (!account) {
                res.status(404).json({ message: `Account ${id} not found` });
            }
            return res.status(200).json({ account: account });
        })
        .catch(err => console.log(err));
};

// Create - POST: create()
exports.createAccount = (req, res, next) => {
    const Name = req.body.name;
    const Password = req.body.password;
    const UnitNo = req.body.unitno;
    const Role = req.body.role;
    const Verified = false;
    Account.create({
        name: Name,
        password: bcrypt.hashSync(Password, 10), // Hashing the password
        unitno: UnitNo,
        role: Role,
        verified: Verified
    })
        .then(result => {
            res.status(201).json({
                message: `Account successfully created, pending verification.`,
                account: result
            });
            }
        )
        .catch(err => console.log(err));
};

// Update - PUT: set() and save()
exports.updateAccount = (req, res, next) => {
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

    Account.findById(id)
        .then(async account => {
            if (!account) {
                return res.status(404).json({ message: `Account ${id} not found!` });
            }

            // Checking: Is account being verified now?
            const isBeingVerified = account.verified === false && updates.verified === true;

            account.set(updates);
            const savedAccount = await account.save();

            // Sending email notification once account has been verified
            if (isBeingVerified) {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: process.env.EMAIL,
                    subject: 'LivingSync Application Update',
                    text: `Dear ${savedAccount.name},\n\nCongratulations! Your request to create an account for Unit: ${savedAccount.unitno} has been approved. You may now log in to your account.\n\nRegards,\nFor and on behalf of the Management Council`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) console.log('Email error:', error);
                    else console.log('Email sent:', info.response);
                });
            }
            return res.status(200).json({ message: `Account ${id} updated!`, account: savedAccount });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

// Configure Email Transporter (to send notice to user upon account request approval/rejection)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Delete - DELETE: findByIdAndDelete()
exports.deleteAccount = (req, res, next) => {
    const { id } = req.params;

    Account.findById(id)
        .then(account => {
            if (!account) {
                return res.status(404).json({ message: `Account ${id} not found!`});
            }

            // Case 1: When rejecting a request to create an account
            if (account.verified === false) {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: process.env.EMAIL,
                    subject: 'LivingSync Application Update',
                    text: `Dear ${account.name},\n\nYour application for a LivingSync account (Unit: ${account.unitno}) has not been successful.\n\nRegards,\nFor and on behalf of the Management Council`
                };
                transporter.sendMail(mailOptions, (err) => { if(err) console.log(err); });
            } 
            
            // Case 2: Deleting an existing User (e.g., selling unit, end of lease)
            else {
                // Send a confirmation and goodbye email
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: process.env.EMAIL,
                    subject: 'LivingSync Account Closed',
                    text: `Dear ${account.name},\n\nYour LivingSync account for Unit ${account.unitno} has been successfully closed and removed from our system.\n\nWe thank you for staying in the estate and wish you all the best.\n\nRegards,\nFor and on behalf of the Management Council`
                };
                transporter.sendMail(mailOptions, (err) => { if(err) console.log(err); });
            }
            // Proceed to delete
            return Account.findByIdAndDelete(id);
        })
        .then(result => {
            res.status(200).json({ message: `Account successfully deleted.`} );
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

// Login - POST: login()
exports.login = async (req, res, next) => {
    const { name, password } = req.body;

    try {
        // 1. Find all accounts with this name
        const accounts = await Account.find({ name: name });
        
        // Filter out unverified or non-existent accounts
        const validAccounts = accounts.filter(acc => acc.verified === true);

        if (validAccounts.length === 0) {
            return res.status(404).json({ message: 'Account not found or not verified' });
        }

        // 2. Verify password
        // All same name accounts share same password, only check of the first
        const mainAccount = validAccounts[0];
        const isMatch = await bcrypt.compare(password, mainAccount.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 3. Generate Token for the Main account (the first one)
        const token = jwt.sign(
            { 
                id: mainAccount._id, 
                role: mainAccount.role,
                name: mainAccount.name // Added name to payload for easier verification later
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
        );

        // 4. Prepare list of available units (Sibling accounts)
        // Mapping this so the frontend has ID and UnitNo to display
        const myUnits = validAccounts.map(acc => ({
            id: acc._id,
            unitno: acc.unitno,
            role: acc.role
        }));

        res.status(200).json({
            message: 'Login successful',
            token: token,
            account: {
                id: mainAccount._id,
                name: mainAccount.name,
                role: mainAccount.role,
                unitno: mainAccount.unitno
            },
            myUnits: myUnits // Send the list of units to frontend
        });    

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Switch Unit - POST: switch-unit
// Allows a logged-in user to get a token for a different unit they own
exports.switchUnit = async (req, res, next) => {
    const { targetAccountId } = req.body;
    const currentName = req.decoded.name; // From JWT Payload

    try {
        // Find the target account
        const targetAccount = await Account.findById(targetAccountId);

        if (!targetAccount) {
            return res.status(404).json({ message: 'Target unit not found' });
        }

        // SECURITY CHECK:
        // Ensure the target account belongs to the same person (same name)
        if (targetAccount.name !== currentName) {
            return res.status(403).json({ message: 'Unauthorized: You do not own this unit.' });
        }

        // Generate new Token for the target unit
        const newToken = jwt.sign(
            { 
                id: targetAccount._id, 
                role: targetAccount.role,
                name: targetAccount.name
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
        );

        res.status(200).json({
            message: `Switched to Unit ${targetAccount.unitno}`,
            token: newToken,
            account: {
                id: targetAccount._id,
                name: targetAccount.name,
                role: targetAccount.role,
                unitno: targetAccount.unitno
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error switching units' });
    }
};