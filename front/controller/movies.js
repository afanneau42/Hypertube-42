const Movies = require('../models/movies');
var request = require('request');
// const Conn = require('../setup/db');

const insertMultiple = (array) => {
    if (array && array.data.movie_count > 0)
    {
        array.data.movies.forEach(e => {
            Movies.create({title: e.title, year: e.year, genre: e.genres, torrents: e.torrents, imdb_id: e.imdb_code, rating: e.rating, cover_image: e.medium_cover_image, background_image: e.background_image, synopsis: e.description_full ? e.description_full : 'No description found', uploaded: 0, runtime: e.runtime, casting:[]}, (err, res) => {
                if (err) throw err;
                
            });
        })
        return 1
    }
    else
        return 0
}

foreach_array = (array) => {
    return new Promise((res) => {
        let array_movies = [];
        array.data.movies.forEach(e => {
            array_movies.push({title: e.title, year: e.year, genre: e.genres, torrents: e.torrents, imdb_id: e.imdb_code, rating: e.rating, cover_image: e.medium_cover_image, background_image: e.background_image, synopsis: e.description_full ? e.description_full : 'No description found', uploaded: 0, runtime: e.runtime, casting:[]})
            
        })
        res(array_movies)
    })
}

const insertMultiple2 = (array) => {
    if (array && array.data.movie_count > 0)
    {
        foreach_array(array)
        .then((array_movies) => {
            Movies.insertMany(array_movies, (err, res) => {
                if (err) throw err;
                return 1
            });
        })
    }
    else
        return 0
}

function requestNewMovies(page) {
    console.log('page:' + page);
    request('https://yifymovie.co/api/v2/list_movies.json?limit=50&page=' + page, function (error, response, body) {
        let parsed_body = JSON.parse(body)    
        if (insertMultiple(parsed_body) !== 0)
            if (parsed_body.data.movies[0])
                requestNewMovies(page + 1)
    })
}

const initMovies = () => {
    requestNewMovies(1);
}

const updateMovies = () => {
    
}

module.exports = {
    insertMultiple,
    initMovies
}