//loginIeltsRoutes.js
const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');


// Route để đăng nhập
router.post('/login', authenticationController.login)
router.post('/register', authenticationController.register);

module.exports = router;
