var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('./VerifyToken');
var mailsender = require('./sendMail');
var generatePassword = require('password-generator');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../models/User');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config/config'); // get config file
const passport = require('passport');



router.post('/login', [
  check('username').exists().isAlphanumeric().isLength({ min: 3 }).withMessage('must be an valid username with at least 3 char '),

  check('password', 'passwords must be at least 5 chars long').isLength({ min: 5 }).exists()
], (req, res, next) => {
  // Get the validation result whenever you want; see the Validation Result API for all options!
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.mapped() });
  }
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) return res.status(200).send('Error on the server.');
    if (!user) return res.status(200).send('No user found.');
    if (user.provider != 'local') { return res.status(200).send("Oauth user"); }
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(200).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    // return the information including token as JSON
    res.status(200).send({ auth: true, token: token });
  });
});

router.get('/logout', function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

const { body } = require('express-validator/check');
router.post('/register', [
  body('username', 'username must be at least 3 chars long and Alphanumeric').exists().isAlphanumeric().isLength({ min: 3 }),
  body('firstname', 'firstname must be at least 2 chars long and Alphanumeric').exists().isAlphanumeric().isLength({ min: 2 }),
  body('lastname', 'lastname must be at least 2 chars long and Alphanumeric').exists().isAlphanumeric().isLength({ min: 2 }),
  body('email', 'Email must be valid').exists().isEmail(),
  body('picture', 'picture must be valid').exists(),
  body('password', 'passwords must be at least 5 chars long').exists().isLength({ min: 5 })
], (req, res, next) => {
  // Get the validation result whenever you want; see the Validation Result API for all options!
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.mapped() });
  }

  // console.log(req.body.username);
  // if (!checkInput(req.body.password, req.body.emails))
  //   res.send(200, {err: true, err_msg: 'input invalid'});
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
  User.findOne({$or:[{'username': req.body.username},{'email':req.body.email}]}, function (err, user) {
    if (err) { return res.status(200).send({ auth:false,err:"There was a problem registering the user`." }); }
    if (user) { 
      return res.status(200).send({auth:false, err:"User already exists."}); 
    }
   if (!user) {
    User.create({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        picture: req.body.picture,
        provider: 'local',
      },
        function (err, user) {
          // if user is registered without errors
          // create a token  auth: true, token: token
          // var token = jwt.sign({ id: user._id }, config.secret, {
          //   expiresIn: 86400 // expires in 24 hours
          // });
          if (err) return res.status(200).send({ auth:false, err:"There was a problem creating the user."});
          if (user){return res.status(200).send({auth:true});
          console.log("success")
        }
          else return res.status(200).send({ auth:false});
          console.log("fail")
        });
    }
  });
});

router.get('/me', VerifyToken, function (req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(200).send("There was a problem finding the user.");
    if (!user) return res.status(200).send("No user found.");
    res.status(200).send(user);
  });

});



router.post('/forgot', [
  body('email', 'Email must be valid').exists().isEmail(),
], (req, res, next) => {
  console.log(req.body)
  // Get the validation result whenever you want; see the Validation Result API for all options!
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.mapped() });
  }

  console.log(req.body);
  var Password = generatePassword(8, false);
  // console.log(Password);
  // console.log(hashedPassword);
  var hashedPassword = bcrypt.hashSync(Password, 8);
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) { return res.status(200).send("There was a problem.") }
    if (!user) { return res.status(200).send("Email not found."); }
    if (user.provider != 'local') { return res.status(200).send("Oauth user"); }
    else {
      User.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true }, function (err, user) {
        let mailOptions = {
          from: '"Hypertube" <hypertube@gmail.com>', // sender address
          to: user.email, // list of receivers
          subject: '🔧 Reset your password !', // Subject line
          text: "🚷 Hello ! Here's your new password : " + Password // plain text body
          // html: '<b>Hello world ?</b>' // html body
        };

        mailsender.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
        });

        res.status(200).send("Password updated");
      }
      );
    }
  });
});


module.exports = router;
