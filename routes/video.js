const express = require('express');
const moviesCtrl = require('../controllers/video');

const router = new express.Router();

router.route('/')
    .get(moviesCtrl.getStream);

router.route('/subtitles')
    .get(moviesCtrl.getSubtitles);


module.exports = router;