//addMovie routes

const express = require('express');

const router = express.Router();

const addMovie = require('../controllers/addMovie');
const movieInfo = require('../controllers/movieInfo');

// Define a route

router.get('/movieInfo/:movieId', movieInfo.getMovieInfo);
router.get('/addMovie', addMovie.addMovie);
router.get('/addListMovies', addMovie.addListMovies);
router.get('/page/:page', movieInfo.getALlMoviesInPage);
router.get('/pages', movieInfo.getNumberOfPages);

module.exports = router;