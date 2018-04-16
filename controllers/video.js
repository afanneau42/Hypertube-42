const ctrlMovies = require('../controllers/movies');
const torrentStream = require('torrent-stream');
const torrentSetup = require('../config/torrent');
const request = require('request');
const path = require('path');
const fs = require('fs');
const pump = require('pump');
const sleep = require('sleep');
var wireSwarm = require('peer-wire-swarm');
var download = require('download-file')
var srt2vtt = require('srt-to-vtt')
// var swarm = wireSwarm(myInfoHash, myPeerId);


const getStream = (req, res) => {
    const { id } = req.query;
    ctrlMovies.isUploaded(id) // Check if the movie is uploaded or not
        .then(arrUploaded => {
            if (arrUploaded[0] === 'err') // If movie not found
                res.send();
            else if (arrUploaded[0]) // If it is uploaded then use stream the local file
                streamExistingMovie(arrUploaded[1], req, res)
            else // Otherwise download it
                downloadMovie(arrUploaded[1], id, req, res);
        }).catch((err) => {
            if (err) throw err;
        })
}

const downloadMovie = (magnet, id, req, res) => {
    let movie_title = '';
    // console.log('on download movie');
    const engine = torrentStream(magnet, torrentSetup);
    engine.on('ready', () => {
        // console.log('Engine ready');
        let fileSize = undefined;
        let filePath = undefined;

        engine.files.forEach(function (file) {
            if (
                path.extname(file.name) !== '.mp4' &&
                path.extname(file.name) !== '.avi' &&
                path.extname(file.name) !== '.mkv' &&
                path.extname(file.name) !== '.ogg'
            ) {
                // console.log('filename deselect:', file.name);
                file.deselect();
                return;
            }
            movie_title = file.name;
            // console.log('filename:', file);
            const ext = path.extname(file.name)

            let total = file.length;
            fileSize = total;
            let start = 0;
            let end = total - 1;
            file.select();

            // console.log(req.headers.range)
            if (req.headers.range) {
                let range = req.headers.range;
                let parts = range.replace(/bytes=/, '').split('-');
                let newStart = parts[0];
                let newEnd = parts[1];
                start = parseInt(newStart, 10);
                // end = newEnd ? parseint(newEnd, 10) : total - 1;

                if (!newEnd) {
                    end = start + 100000000 >= total ? total - 1 : start + 100000000;
                }
                else
                    end = parseint(newEnd, 10);
                let chunksize = end - start + 1;
                filePath = path.resolve(torrentSetup.path + '/' + file.path);
                let head = {
                    'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/' + ext.replace('.', ''),
                    Connection: 'keep-alive'
                }
                // console.log(head)
                res.writeHead(206, head);

                let stream = file.createReadStream({
                    start: start,
                    end: end
                });
                pump(stream, res);
            }
            else {
                res.send('Wrong header');
            }
        });
        engine.on('download', () => {
            // console.log('\n\n\n\n\n\n\n\nUIBAIUDU NAD(N(ANCN AN ND)CNA)N)N');
            console.log(movie_title.slice(0, -4), Math.trunc(engine.swarm.downloaded / fileSize * 100) + '%');
        })
        engine.on('idle', () => { // When the movie is downloaded -> update filePath in db and uploaded to 1
            console.log('downloaded' + filePath);
            ctrlMovies.updateMoviePath(id, filePath);
        })
    })
}

function streamExistingMovie(filePath, req, res) {
    console.log('Streaming existing file');
    let stat = fs.statSync(filePath)
    if (!stat) {
        console.log('file do not exists !');
        return;
    }
    let total = stat.size;
    const ext = path.extname(filePath)
    if (req.headers.range) {
        let range = req.headers.range;
        let parts = range.replace(/bytes=/, '').split('-');
        let newStart = parts[0];
        let newEnd = parts[1];
        start = parseInt(newStart, 10);
        end = newEnd ? parseint(newEnd, 10) : total - 1;
        let chunksize = end - start + 1;
        let head = {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/' + ext.replace('.', ''),
            Connection: 'keep-alive'
        }
        // console.log(head)
        res.writeHead(206, head);

        let stream = fs.createReadStream(filePath, {
            start: start,
            end: end
        });
        pump(stream, res);
    }
    else {
        res.writeHead(200, {
            'Content-Length': total,
            'Content-Type': 'video/' + ext.replace('.', '')
        });
        let stream = fs.createReadStream(filePath, {
            start: start,
            end: end
        });
        pump(stream, res);
    }
}

const getSubtitles = (req, res) => {
    if (!req.query.lang || (req.query.lang !== 'en' && req.query.lang !== 'fr' && req.query.lang !== 'du' && req.query.lang !== 'sp' && !req.get('User-Agent')[0] === 'M') || !req.query.movie_id || !req.query.imdb_id)
        res.send();
    else {
        if (fs.existsSync(path))
            res.send('OK');
        else
            downloadSubtitles(req.query.lang, req.query.imdb_id, res);
    }
}

const downloadSubtitles = (lang, imdb_id, res) => {
    let newLang = lang;
    switch (lang) {
        case 'fr':
            newLang += 'e';
            break;
        case 'en':
            newLang += 'g';
            break;
        case 'ge':
            newLang += 'r';
            break;
        case 'sp':
            newLang += 'a';
            break;
    }
    openSub.search({
        sublanguageid: newLang,
        imdbid: imdb_id
    }).then((results) => {
        let subs = results[Object.keys(results)[0]]
        if (!subs)
            res.send('No subtitles found in' + lang)
        var url = subs.url;

        let filename = imdb_id + '_' + lang;

        var options = {
            directory: "/tmp/",
            filename: filename + '.srt',
            extensions: ['srt']
        }

        download(url, options, function (err) {
            if (err) throw err
            fs.createReadStream('/tmp/' + filename + '.srt')
                .pipe(srt2vtt())
                .pipe(fs.createWriteStream('front/public/subs/' + filename + '.vtt'))
            res.send('OK');
        })

    }).catch((err) => {
        if (err)
            res.send(err);
    })
}

module.exports = {
    getStream,
    getSubtitles
}