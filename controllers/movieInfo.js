//MangaController.js
const mysql = require('mysql2');

const jsonFile = require('../movies.json');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0007',
    database: 'movielist',
});


const getMovieInfo = (req, res) => {
    //parameters are sent in the request object
    const movieId = req.params.movieId;
    console.log(movieId);
};

module.exports = {
    getMovieInfo
};