//MangaController.js
const mysql = require('mysql2');

const jsonFile = require('../movies.json');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0007',
    database: 'movielist',
});


// Define the controller function
const addMovie = (movieData, callback) => {
    // Insert the movie into the Movies table
    const movieDataSet = {
        tmdb_id: movieData.tmdb_id,
        imdb_id: movieData.imdb_id,
        title: movieData.title,
        english_title: movieData.english_title,
        backdrop_path: movieData.backdrop_path,
        imdb: movieData.imdb,
        release_date: movieData.release_date,
        runtime: movieData.runtime,
        hash: movieData.hash,
        updated: movieData.updated
    };

    db.query('INSERT INTO Movies SET ?', movieDataSet, (err, movieResult) => {
        if (err) {
            console.error('Error inserting movie:', err);
            return callback(err);
        }

        const movieId = movieResult.insertId;
        const genreIds = movieData.genre_ids;

        // Construct the SQL query to insert genre associations
        const insertGenreQuery = 'INSERT INTO MovieGenres (movie_id, genre_id) VALUES ?';

        // Create an array of genre values to insert
        const genreValues = genreIds.map(genreId => [movieId, genreId]);

        // Insert the genre associations into the MovieGenres table
        db.query(insertGenreQuery, [genreValues], (err) => {
            if (err) {
                console.error('Error inserting genre associations:', err);
                return callback(err);
            }

            callback(null, movieId);
        });
    });
};



// Example usage
const movieData = {
    "id": 1562,
    "tmdb_id": 11186,
    "imdb_id": "tt0099253",
    "title": "Búp Bê Sát Nhân 2",
    "english_title": "Child's Play 2",
    "backdrop_path": "/zkz2kgGAqwwiqLnpfhTNEjAjPa1.jpg",
    "imdb": 5.9,
    "release_date": "1990-11-09",
    "runtime": 84,
    "genre_ids": [
        27,
        53
    ],
    "hash": "82575D19BC24EF2827E99B6291FE64F917615440",
    "updated": "2021-11-01T04:14:43.814+00:00"
}

// addMovie(movieData, (err, movieId) => {
//     if (err) {
//         console.error('Error adding movie:', err);
//     } else {
//         console.log('Movie added with ID:', movieId);
//     }
// });


// addMovie(movieData, (err, movieId) => {
//     if (err) {
//         console.error('Error adding movie:', err);
//     } else {
//         console.log('Movie added with ID:', movieId);
//     }
// });


//add list of movies from json file
const addListMovies = (req, res) => {

    console.log(jsonFile[0]);
    const movies = jsonFile;

    //add new movie to the database
    try {
        movies.forEach((movie) => {
            addMovie(movie, (err, movieId) => {
                if (err) {
                    console.error('Error adding movie:', err);
                } else {
                    console.log('Movie added with ID:', movieId);
                }
            });
        }
        );
    }
    catch (error) {
        console.log(error);
    }
};

addListMovies();

// Export the controller function
module.exports = { addMovie, addListMovies };
