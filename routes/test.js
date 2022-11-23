const express = require('express');

const {
    fetchRecord
} = require('../controllers/test');

const router = express.Router();

router.route('/fetch').get(fetchRecord);

module.exports = router;