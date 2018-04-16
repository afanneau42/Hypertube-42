const Movies = require('../models/movies');
var request = require('request');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
const imdb = require('imdb-api')
const pirateBay = require('thepiratebay')
var ptn = require('parse-torrent-name');
const mongoose = require('mongoose');
const oId = mongoose.Types.ObjectId;
var jwt = require('jsonwebtoken');
var config = require('../config/config');

let init_page = 0;
let suggest_nb = 0;


const insertMultiple = (array) => {
    console.log('Progress: ' + Math.round(init_page * 50 / 6700 * 100) + '%');
    init_page += 1;
    if (array && array.data.movie_count > 0) {
        array.data.movies.forEach(e => {
            // console.log(e)

            request(e.medium_cover_image, function (error, response, body) {
                // console.log('error:', error); // Print the error if one occurred and handle it
                // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                if (response && response.statusCode == 200 ) {
                    Movies
                        .create({
                            title: e.title,
                            year: e.year,
                            genre: e.genres,
                            torrents: e.torrents,
                            imdb_id: e.imdb_code,
                            rating: e.rating,
                            cover_image: e.medium_cover_image,
                            background_image: e.background_image,
                            synopsis: e.description_full ? e.description_full : 'No description found',
                            uploaded: 0,
                            runtime: e.runtime,
                            casting: []
                        }, (err, res) => {
                            // if (err) throw err;
                        });
                }
            });
        })
        return 1
    }
    else
        return 0
}

function requestNewMovies(page) {
    request('https://yifymovie.co/api/v2/list_movies.json?limit=50&page=' + page, function (error, response, body) {
        let parsed_body = JSON.parse(body)
        if (insertMultiple(parsed_body) !== 0)
            if (parsed_body.data.movies[0])
                requestNewMovies(page + 1)
            else
                requestSuggest()
    })
}

const requestSuggest = () => {
    console.log('Initialization of the suggest list');
    pirateBay.topTorrents(201)
        .then(results => {
            let movie_nb = results.length;
            results.forEach((e, i) => {
                let info = ptn(e.name)
                imdb.search({ title: info.title, year: info.year }, {
                    apiKey: '976c2b32'
                }).then(data => {
                    if (data.results[0] && data.results[0].title && data.results[0].imdbid) {
                        Movies
                            .find({ imdb_id: data.results[0].imdbid }, (err, doc) => {
                                if (doc[0]) {
                                    if (!doc[0].suggest_pos) {
                                        Movies
                                            .findByIdAndUpdate(doc[0]._id, { suggest_pos: i }, (err, doc) => {
                                                if (err) throw err;
                                                suggest_nb++;
                                                console.log('Progress suggest :' + Math.round(suggest_nb/movie_nb * 100) + '%');
                                            });
                                    }
                                    else {
                                        suggest_nb++;
                                        console.log('Progress suggest :' + Math.round(suggest_nb/movie_nb * 100) + '%');
                                    }
                                }
                                else {
                                    suggest_nb++;
                                    console.log('Progress suggest :' + Math.round(suggest_nb/movie_nb * 100) + '%');
                                }
                                // else if (!err) {
                                //     imdb.getById(data.results[0].imdbid, {
                                //         apiKey: '976c2b32', timeout: 30000
                                //     }).then((mov) => {
                                //         const reg = new RegExp('^' + 'https://ia.media-imdb.com/');
                                //         if (mov && !reg.test(mov.poster) && mov.rating) {
                                //             Movies
                                //                 .create({
                                //                     title: mov.title,
                                //                     year: mov.year,
                                //                     genre: mov.genres.split(", "),
                                //                     torrents: [['magnetLink', e.magnetLink]],
                                //                     imdb_id: data.results[0].imdbid,
                                //                     rating: mov.rating !== 'N/A' ? mov.rating : undefined,
                                //                     cover_image: mov.poster,
                                //                     background_image: undefined,
                                //                     synopsis: mov.plot ? mov.plot : 'No description found',
                                //                     uploaded: 0,
                                //                     runtime: parseInt(mov.runtime.replace(' min', '')),
                                //                     casting: [mov.director, mov.actors],
                                //                     suggest_pos: i
                                //                 }, (err, res) => {
                                //                 });
                                //         }
                                //     }).catch(console.log);
                                // }
                            })
                    }
                    else {
                        suggest_nb++;
                        console.log('Progress suggest :' + Math.round(suggest_nb/movie_nb * 100) + '%');
                    }
                }).catch(err => {
                    suggest_nb++;
                    console.log('Progress suggest :' + Math.round(suggest_nb/movie_nb * 100) + '%');
                })
            })
        }).then(() => {
            // console.log('Initialization finished')
        }).catch((err) => {
        })
}

const initMovies = () => {
    Movies.find((err, docs) => {
        if (!docs[0])
            requestNewMovies(1);
    })
}

const resetTimer = (id) => {
    Movies
        .findByIdAndUpdate(oId(id), { last_watched: Date.now() }, (err, doc) => {
            if (err) throw err;
        })
}

const deleteOld = () => {
    let prevMonth = new Date()
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    Movies
        .find({ last_watched: { $lt: prevMonth }, uploaded: 1 }, (err, doc) => {
            doc.forEach((e) => {
                if (path.resolve(e.file_path)) {
                    rimraf(e.file_path, (err) => {
                        if (err) throw err;
                    })
                    Movies
                        .findByIdAndUpdate(e._id, { uploaded: 0, $unset: { file_path: '' } }, (err, doc) => {
                            if (err) throw err;
                        });
                }
            })
        });
}

const isUploaded = (id) => {
    return new Promise((res, rej) => {
        Movies
            .find({ _id: id }, (err, doc) => {
                if (doc && doc[0]) {
                    console.log('Torrent not uploaded');
                    if (doc[0].uploaded === 0) {
                        if (doc[0].torrents[0].hash)
                            return res([false, 'magnet:?xt=urn:btih:' + doc[0].torrents[0].hash]);
                        else
                            return res([false, 'magnet:?xt=urn:btih:' + doc[0].torrents[0][1]]);
                    }
                    else
                        return res([true, doc[0].file_path]);

                }
                else
                    return res(['err', 'Movie not found']);
            });
    })
}

//page, sort_by, sort_order, f_title, f_rating, f_genre, f_year, f_suggest

const getMovies = (req, res) => {
    var jwtToken = req.headers['x-access-token'];
    let { page, sort_by, sort_order, f_title, f_rating_min, f_rating_max, f_genre, f_year_min, f_year_max, f_suggest } = req.query
    console.log(page)
    var re = new RegExp(f_title, "i");
    let sort = {};
    sort_by ? sort[sort_by] = sort_order ? sort_order : 1 : sort['title'] = sort_order ? sort_order : 1;
    let query = {};
    f_title ? query.title = { $regex: re } : 0;
    f_rating_min && f_rating_max ? query.rating = { $gte: f_rating_min, $lte: f_rating_max } : 0;
    f_genre ? query.genre = f_genre : 0
    f_year_min && f_year_max ? query.year = { $gte: f_year_min, $lte: f_year_max } : 0;
    f_suggest ? query.suggest_pos = { $exists: true } : 0

    Movies
        .find(query)
        .limit(12)
        .skip((page - 1) * 12)
        .sort(sort)
        .exec((err, doc) => {
            if (!doc[0])
                res.send({ error: true });
            else
                res.send(doc);
        })
}

const getMovieById = (req, res) => {
    let { id } = req.query;
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if (!checkForHexRegExp.test(id)) {
        res.send({ error: 'wrong id format' })
        return;
    }
    Movies
        .find({ _id: oId(id) })
        .exec((err, doc) => {
            if (!doc[0])
                res.send({ error: true })
            else if (doc[0].casting[0]) {
                res.send(doc[0])
            }
            else {
                imdb.getById(doc[0].imdb_id, {
                    apiKey: '976c2b32', timeout: 30000
                }).then((mov) => {
                    let rating = !doc[0].rating ? mov.rating ? mov.rating : 0 : doc[0].rating;
                    Movies
                        .findByIdAndUpdate(oId(doc[0]._id), { casting: [mov.director, mov.actors], synopsis: mov.plot ? mov.plot : 'No description found', rating }, (err, doc2) => {
                            if (err) throw err;
                            res.send(doc2);
                        });
                }).catch((err) => {
                    if (err) throw err;
                })
            }
        })
}

const updateMoviePath = (movieId, filePath) => { // Find a movie update uploaded to 1 and file_path to the path given in parameter
    if (!movieId || !filePath)
        return;
    // if (!fs.existsSync(path)) {
    //     console.log('Path do not exists');
    //     return ;
    // }
    Movies
        .findOneAndUpdate({ _id: oId(movieId) }, { $set: { uploaded: 1, file_path: filePath } }, (err, doc) => {
            if (err)
                console.log(err);
            console.log('File ' + doc.title + ' saved at ' + filePath);
            return;
        });
}

const movieWatched = (req, res) => {
    console.log('\n\n\n\n MOVIE WATCHED')
    var jwtToken = req.headers['x-access-token'];
    if (!jwtToken)
        return res.status(200).send({ message: 'No token provided.' });
    jwt.verify(jwtToken, config.secret, function (err, decoded) {
        if (!err && decoded && decoded.id) {
            Movies
                .findOneAndUpdate({ _id: oId(req.query.movie_id) }, { $push: { history: decoded.id } }, (err, doc) => {
                    if (err)
                        console.log(err);
                    resetTimer(req.query.movie_id);
                    console.log('User ' + decoded.id + ' watched');
                    return res.status(200).send({ message: 'History succefully updated.' });
                });
        }
        else
            return res.status(200).send({ message: 'Token error.' });
    });
};



module.exports = {
    movieWatched,
    initMovies,
    requestSuggest,
    resetTimer,
    deleteOld,
    getMovies,
    getMovieById,
    isUploaded,
    updateMoviePath
}

// Fonctions pour les recherches de films, 