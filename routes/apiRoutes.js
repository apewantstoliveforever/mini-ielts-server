const express = require('express');
const router = express.Router();
const refreshTokenController = require('../refreshToken');

// Route để refresh token
router.post('/refreshToken', refreshTokenController.refreshToken);

module.exports = router;