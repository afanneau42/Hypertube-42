const express = require('express');
const commentsCtrl = require('../controllers/comments');

const router = new express.Router();

router.route('/byId')
    .get(commentsCtrl.getComments);

router.route('/')
    .post(commentsCtrl.addComment);

module.exports = router;