const mongoose = require('mongoose');

// Importing dotenv to manage environment variables
require('dotenv').config();
const mongoURL = process.env.DATABASE_URL;

// Connecting the database to server by Mongoose
mongoose.connect(mongoURL);
const database = mongoose.connection;

database.on('error', (error) => {
    console.error(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

module.exports = database;