//addMovie routes

const express = require('express');

const router = express.Router();

const addMovie = require('../controllers/addMovie');

router.get('/addMovie', addMovie.addMovie);
router.get('/addListMovies', addMovie.addListMovies);

module.exports = router;