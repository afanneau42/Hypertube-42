const passport = require('passport');
var JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt,
    LocalStrategy = require('passport-local').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    FortyTwoStrategy = require('passport-42').Strategy,
    FacebookStrategy =require('passport-facebook').Strategy,
    DropboxOAuth2Strategy =require('passport-dropbox-oauth2').Strategy,
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
;

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// load up the user model
var User = require('../models/User');
var config = require('./config'); // get db config file
var bcrypt = require('bcryptjs');
var findOrCreate = require('mongoose-findorcreate')


// // =========================================================================
// // LINKEDIN ==================================================================
// // =======
passport.use(new LinkedInStrategy({
    clientID: "77x56ddwgiqyix",
    clientSecret: "7W7fRQyGFsCw1maA",
    callbackURL: "http://localhost:3000/api/auth/login/linkedin/",
    scope: ['r_emailaddress', 'r_basicprofile']
  }, function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    let newUser = {
        email: profile._json.emailAddress,
        firstname: profile._json.firstName,
        lastname: profile._json.lastName,
        username: profile._json.formattedName.replace(" ",""),
        picture: profile._json.pictureUrl,
        linkedinid: profile._json.id,
        provider: 'linkedin'
    };
    User.findOrCreate({ linkedinid: profile._json.id }, newUser, function (err, user) {
        const token = jwt.sign({id: user._id}, config.secret,{
            expiresIn: 86400 // expires in 24 hours
          });
      console.log(token);
      return done(err, user, token);
  
    });
  }
));

// // =========================================================================
// // DROPBOX ==================================================================
// // =========================================================================

passport.use(new DropboxOAuth2Strategy({
    apiVersion: '2',
    clientID: "53jfj2x8ikozoom",
    clientSecret: "dywgu211anrwhjq",
    callbackURL: "http://localhost:3000/api/auth/login/dropbox/"
  },
  function(accessToken, refreshToken, profile, done) {
    let newUser = {
        email: profile._json.email,
        firstname: profile._json.name.given_name,
        lastname: profile._json.name.surname,
        username: profile._json.name.display_name.replace(" ",""),
        dropboxid: profile.id,
        provider: 'dropbox'
    };
        // console.log(profile);
    User.findOrCreate({ dropboxid: profile.id }, newUser, function (err, user) {
        const token = jwt.sign({id: user._id}, config.secret,{
            expiresIn: 86400 // expires in 24 hours
          });
      console.log(token);
      return done(err, user, token);
  
    });
  }
));
// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
passport.use(new FacebookStrategy({
    clientID: "1177591662377610",
    clientSecret: "8f941b31566860f47f08a6658bd81e6f",
    callbackURL: "http://localhost:3000/api/auth/login/facebook/",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    //   console.log(profile);
      var name = profile._json.name;
var fname = name.split(" ");
    let newUser = {
        email: profile._json.email,
        firstname: fname[0],
        lastname: fname[1],
        username: profile._json.name.replace(" ",""),
        facebookid: profile._json.id,
        provider: 'facebook'
    };
    User.findOrCreate({ facebookid: profile.id }, newUser, function (err, user) {
        const token = jwt.sign({id: user._id}, config.secret,{
            expiresIn: 86400 // expires in 24 hours
          });
      console.log(token);
      return cb(err, user, token);
  
    });
  }
));
// =========================================================================
// GitHub ==================================================================
// =========================================================================

passport.use(new GitHubStrategy({
    clientID: 'dc9db468187e35ef40af',
    clientSecret: 'ac1a066dd45bfc881873ce07e7a9ce9010fab444',
    callbackURL: "http://localhost:3000/api/auth/login/github/"
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    var name = profile._json.name;
    var fname = name.split(" ");
    let newUser = {
        email: profile._json.email,
        username: profile._json.login,
        firstname: fname[0],
        lastname: fname[1],
        picture: profile._json.avatar_url,
        githubid: profile._json.id,
        provider: 'github'
    };
    User.findOrCreate({ githubid: profile.id }, newUser, function (err, user) {
      const token = jwt.sign({id: user._id}, config.secret,{
          expiresIn: 86400 // expires in 24 hours
        });
    console.log(token);
    return cb(err, user, token);

    });
  
}
));

// =========================================================================
// 42 ======================================================================
// =========================================================================
passport.use(new FortyTwoStrategy({
    clientID: '9747f1cbc4a2e8a72f1d0d20cae899c8a9a2b023da984dcc2e1cb6b58409344e',
    clientSecret: '39011aebdadc9e1007f80c4d7dcb5a51d310039047ce9163dc164bcd697d3422',
    callbackURL: 'http://localhost:3000/api/auth/login/42/'
},
function (accessToken, refreshToken, profile, cb) {
    // console.log(profile);    
    let newUser = {
        email: profile._json.email,
        username: profile._json.login,
        firstname: profile._json.first_name,
        lastname: profile._json.last_name,
        picture: profile._json.image_url,
        fortytwoid: profile._json.id,
        provider: '42'
    };
    User.findOrCreate({fortytwoid: profile._json.id}, newUser, function (err, user) {
        const token = jwt.sign({id: user._id}, config.secret,{
            expiresIn: 86400 // expires in 24 hours
          });
      console.log(token);
      return cb(err, user, token);
  
      });
}
));
  passport.use(new JWTStrategy({
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
          secretOrKey   : config.secret
      },
      function (jwtPayload, cb) {

          //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
          return UserModel.findOneById(jwtPayload.id)
              .then(user => {
                  return cb(null, user);
              })
              .catch(err => {
                  return cb(err);
              });
      }
  ));

module.exports = passport; 
