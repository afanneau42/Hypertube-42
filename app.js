var express = require('express');
var morgan = require('morgan');
var passport = require('passport');
var app = express();
var db = require('./config/db');
var config = require('./config/config'); // get our config file
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
bParser = require('body-parser'),
  path = require("path"),
  fs = require("fs"),
  mime = require("mime-types"),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  cors = require('cors'),
  imdb = require('imdb-api'),
  pirateBay = require('thepiratebay'),
  oSub = require('opensubtitles-api'),
  openSub = new oSub('TemporaryUserAgent'),
  torrentStream = require('torrent-stream'),
  pump = require('pump'),
  translate = require('google-translate-api'),
  MongoClient = require("mongodb").MongoClient,
  request = require('request'),
  oId = mongoose.Types.ObjectId,
  ptn = require('parse-torrent-name');

const torrent_dir = path.resolve('/goinfre')
//==============================================================================
/**
 *Module Variables
 */

var router = require('./routes');
//==============================================================================
/**
 *Middleware
 */
app.use(cors()); //--> Allow Cross Origins Ressources Sharing

app.use(morgan());

app.use(flash());

app.use(bParser.json({ limit: '5mb' }));

app.use(bParser.urlencoded({ extended: true, limit: '5mb' }));

app.use('/assets', express.static('public'))
app.use('/goinfre', express.static('/goinfre'))

mime.lookup('.vtt')

// Add headers

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let Strategy = require('./config/passport');

app.use(passport.initialize());


app.get('/api/auth/login/github', function (req, res, next) {
  passport.authenticate('github', { session: false },
    function (err, user, token) {
      if (token) {
        const jwtToken = token.split('.');
        console.log(jwtToken);
        return res.redirect(`http://localhost:8080/strategy/${jwtToken[0]}/${jwtToken[1]}/${jwtToken[2]}`);
      }
      // else return res.status(200).send({auth: false});
      else return res.redirect(`http://localhost:8080/login/oAuth=false`)
      // .status(200).send({token: token})
    })(req, res, next);
});


app.get('/api/auth/login/42', function (req, res, next) {
  passport.authenticate('42', { session: false },
    function (err, user, token) {
      if (token) {
        const jwtToken = token.split('.');
        console.log(token);
        console.log(jwtToken);
        res.redirect(`http://localhost:8080/strategy/${jwtToken[0]}/${jwtToken[1]}/${jwtToken[2]}`);  //res.status(200).send({token: token});
      }
      else return res.status(200).send({ auth: false });
    })(req, res, next);
});

app.get('/api/auth/login/facebook', function (req, res, next) {
  passport.authenticate('facebook', { session: false, scope: ['email'] },
    function (err, user, token) {
      if (token) {
        const jwtToken = token.split('.');
        console.log(token);
        console.log(jwtToken);
        res.redirect(`http://localhost:8080/strategy/${jwtToken[0]}/${jwtToken[1]}/${jwtToken[2]}`);
      }
      else return res.status(200).send({ auth: false });

      //    res.status(200).send({token: token});
    })(req, res, next);
});

app.get('/api/auth/login/dropbox', function (req, res, next) {
  passport.authenticate('dropbox-oauth2',
    function (err, user, token) {
      if (token) {
        const jwtToken = token.split('.');
        console.log(token);
        console.log(jwtToken);
        res.redirect(`http://localhost:8080/strategy/${jwtToken[0]}/${jwtToken[1]}/${jwtToken[2]}`);
        //res.status(200).send({token: token});
      }
      else return res.status(200).send({ auth: false });
    })(req, res, next);
});

app.get('/api/auth/login/linkedin', function (req, res, next) {
  passport.authenticate('linkedin', function (err, user, token) {
    if (token) {
      const jwtToken = token.split('.');
      console.log(token);
      console.log(jwtToken);
      res.redirect(`http://localhost:8080/strategy/${jwtToken[0]}/${jwtToken[1]}/${jwtToken[2]}`);  //res.status(200).send({token: token});
    }
    else return res.status(200).send({ auth: false });
  })(req, res, next);
});
var AuthController = require('./controllers/AuthController');
app.use('/api/auth', AuthController);



var UserController = require('./controllers/UserController');
app.use('/api/users', UserController);

app.use('/api', router);

//==============================================================================


const moviesCtrl = require('./controllers/movies');

moviesCtrl.initMovies()

moviesCtrl.deleteOld();




/**
 *Export Module
 */
module.exports = app;
