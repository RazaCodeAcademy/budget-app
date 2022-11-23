const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const logger = require('./middleware/logger');
const connectDB = require('./config/db');

// route files
const auth = require("./routes/auth");

// load env variables
dotenv.config({ path: "./config/.env" });

// connect to databse
connectDB();

const app = express();

// body parser
app.use(express.json());

// loging middleware
app.use(logger);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// mount routers
app.use("/api/auth", auth);

const PORT = process.env.PORT || 5000;

// create server
const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);


// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    // close server & exit process
    server.close(() => process.exit(1));
})
