const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    movie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movies',
        // required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        // required: true
    }
})

const Comments = mongoose.model('Comments', commentsSchema);


module.exports = Comments;