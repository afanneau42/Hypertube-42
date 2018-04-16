var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../models/User');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var bcrypt = require('bcryptjs');
// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, { password: 0 }, function (err, user) {
        if (err) return res.status(200).send("There was a problem finding the user.");
        if (!user) return res.status(200).send("No user found.");
        res.status(200).send(user);
    });
});

const { body } = require('express-validator/check');

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', [
    body('username', 'username must be at least 3 chars long and Alphanumeric').isAlphanumeric().isLength({ min: 3 }).optional(),
    body('firstname', 'firstname must be at least 2 chars long and Alphanumeric').isAlphanumeric().isLength({ min: 2 }).optional(),
    body('lastname', 'lastname must be at least 2 chars long and Alphanumeric').isAlphanumeric().isLength({ min: 2 }).optional(),
    body('email', 'Email must be valid').isEmail().optional(),
    body('picture', 'picture must be valid').isString().optional(),
    body('password', 'passwords must be at least 5 chars long').isLength({ min: 5 }).optional()
], (req, res, next) => {
    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.mapped() });
    }
    // Get the validation result whenever you want; see the Validation Result API for all options!
    var jwtToken = req.headers['x-access-token'];
    if (!jwtToken)
        return res.status(200).send({ message: 'No token provided.' });
    jwt.verify(jwtToken, config.secret, function (err, decoded) {
        if (!err && decoded && decoded.id) {
            if (req.params.id == decoded.id) {
                console.log(req.body)
                User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
                    if (err) return res.status(200).send("There was a problem updating the user.");
                    res.status(200).send(user);
                });
            }

        }
    });


});


module.exports = router;