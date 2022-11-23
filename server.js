const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

// load env variables
dotenv.config({path: './config/.env'});

// route files
const test = require('./routes/test');

const app = express();

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// mount routers
app.use('/api/test', test);

const PORT = process.env.PORT || 5000;

// create server
const server = app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);