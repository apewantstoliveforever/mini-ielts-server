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
    // parameters are sent in the request object
    const page = parseInt(req.params.page); // Parse the page parameter to ensure it's an integer
    // get movie info from the database
    const offset = (page - 1) * 20; // Calculate the offset based on the page number
    db.query('SELECT * FROM Movies LIMIT ?, 20', [offset], (err, results) => {
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
                // res.status(200).send(results[0]/20);
                const result = results[0]['COUNT(*)'];
                res.status(200).send({ pages: Math.ceil(result / 20) });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
//get all movies based on genre
const getMoviesByGenre = (req, res) => {
    // Parameters are sent in the request object
    const genre = req.params.genre;
    console.log(genre);
    
    // Get movie IDs from the database based on genre
    db.query('SELECT * FROM moviegenres WHERE genre = ?', [genre], (err, results) => {
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



module.exports = {
    getMovieInfo,
    getALlMoviesInPage,
    getNumberOfPages,
    getMoviesByGenre
};