const express = require('express');

const {
    register,
    emailVerification
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.put('/email-verification/:verifiedToken', emailVerification);

module.exports = router;