var
    express = require('express'),
    passport = require('../config/passport'),
    router = express.Router(),
    translate = require('google-translate-api'),
    movies = require('./movies'),
    comments = require('./comments'),
    video = require('./video')

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});

router.use('/movies', movies)
router.use('/video', video);
router.use('/comments', comments);

// translate

router.get('/translate', (req, res) => {
    let { str, lang } = req.query;

    translate(str, { to: lang }).then(ret => {
        console.log(ret.text);
        //=> I speak English
        console.log(ret.from.language.iso);
        //=> nl
        res.send(ret.text);
    }).catch(err => {
        console.error(err);
        res.send();
    });
})


module.exports = router;