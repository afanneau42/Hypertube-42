const Comments = require('../models/comments');
var jwt = require('jsonwebtoken');
var config = require('../config/config');


const addComment = (req, res) => {
    let { movie_id, author_id, comment } = req.query;
    const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if (!checkForHexRegExp.test(movie_id)) {
        res.send({ error: 'wrong movie id format' })
        return;
    } else if (!checkForHexRegExp.test(author_id)) {
        res.send({ error: 'wrong user id format' })
        return;
    }
    var jwtToken = req.headers['x-access-token'];
    if (!jwtToken)
        return res.status(200).send({ message: 'No token provided.' });
    jwt.verify(jwtToken, config.secret, function (err, decoded) {
        if (!err && decoded && decoded.id) {
            if (author_id == decoded.id){
    Comments
        .create({
            movie_id: movie_id,
            author_id: author_id,
            content: comment,
            date: Date.now()
        }, (err, doc) => {
            res.send(doc);
            // if (!doc[0])
            //     res.send({ error: 'Failure' });
            // else
            //     res.send({ success: { doc, message: 'post successful' } })
        });
    }
    }
    })
};

const getComments = (req, res) => {
    let { id } = req.query;
    const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if (!checkForHexRegExp.test(id)) {
        res.send({ error: 'wrong id format' })
        return;
    }
    Comments
        .find({ movie_id: id })
        .sort({ date: -1 })
        .exec((err, doc) => {
            console.log('get comments', doc);
            if (!doc[0])
                res.send({ error: true })
            else
                res.send(doc);
        })
}

// const getComments = (movie_id) => {
//     Comments
//         .find({ movie_id: movie_id })
//         .sort({ date: -1 })
//         .exec((err, doc) => {
//             return doc;
//         })
// }

module.exports = {
    addComment,
    getComments
}