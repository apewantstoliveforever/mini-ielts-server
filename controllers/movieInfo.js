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
    //get movie info from the database
    db.query('SELECT * FROM movies WHERE id = ?', [movieId], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.status(200).send(results[0]);
            } else {
                res.status(404).send('Movie not found');
            }
        }
    });
};

module.exports = {
    getMovieInfo
};