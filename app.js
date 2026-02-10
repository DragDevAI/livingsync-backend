const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

// Initializing the express application
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(express.json());

app.use(cors());

// Creating routes for the endpoints
app.use('/account', require('./routes/rAccount'));
app.use('/unit', require('./routes/rUnit'));
app.use('/financial', require('./routes/rFinancial'));
app.use('/document', require('./routes/rDocument'));
app.use('/car', require('./routes/rCar'));
app.use('/visitor', require('./routes/rVisitor'));
app.use('/bbq', require('./routes/rBBQ'));
app.use('/function', require('./routes/rFunction'));
app.use('/renovation', require('./routes/rRenovation'));
app.use('/report', require('./routes/rReport'));

// Starting the Lerver
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

// Connecting to the database
const database = require('./util/db');