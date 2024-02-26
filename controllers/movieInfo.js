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
    db.query('SELECT * FROM Movies WHERE id = ?', [movieId], (err, results) => {
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

const getALlMoviesInPage = (req, res) => {
    //parameters are sent in the request object
    const page = req.params.page;
    //get movie info from the database
    db.query('SELECT * FROM Movies LIMIT ?, 20', [page], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.status(200).send(results);
            } else {
                res.status(404).send('Movie not found');
            }
        }
    });
};

const getNumberOfPages = (req, res) => {
    //get number of page each page has 20 movies
    try {
        db.query('SELECT COUNT(*) FROM Movies', (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send(results[0]);
            }
        });
        //number of page = number of movies / 20
        const numberOfPage = results[0] / 20;
        return res.status(200).send(numberOfPage);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getMovieInfo,
    getALlMoviesInPage,
    getNumberOfPages
};