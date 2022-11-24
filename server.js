const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const logger = require('./middleware/logger');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
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

// cookie parser
app.use(cookieParser());

// loging middleware
app.use(logger);

// file uploading
app.use(fileupload());

// sanitizi data
app.use(mongoSanitize());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// set security headers
app.use(helmet());

// prevent xss attacks
app.use(xss());

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// enable CORS
app.use(cors());

// mount routers
app.use("/api/auth", auth);

app.use(errorHandler);

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
