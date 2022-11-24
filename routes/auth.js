const express = require('express');

const {
    register,
    login,
    logout,
    emailVerification
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register)
.post('/login', login)
.get('/logout', logout)
.put('/email-verification/:verifiedToken', emailVerification);

module.exports = router;