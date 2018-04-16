const express = require('express');
const moviesCtrl = require('../controllers/movies');

const router = new express.Router();

router.route('/')
    .get(moviesCtrl.getMovies);

router.route('/byId')
    .get(moviesCtrl.getMovieById);

router.route('/history')
    .put(moviesCtrl.movieWatched);

module.exports = router;
