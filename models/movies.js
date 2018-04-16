const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: Array,
        required: true
    },
    torrents: {
        type: Array,
        required: true
    },
    imdb_id: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
    },
    cover_image: {
        type: String,
        required: true        
    },
    background_image: {
        type: String,
    },
    synopsis: {
        type: String,
        required: true
    },
    uploaded: {
        type: Number,
        default: 0,
        enum: [0, 1],
        required: true
    },
    runtime: {
        type: Number,
        required: true
    },
    casting: {
        type: Array,
        required: true
    },
    last_watched: {
        type: Date,
        default: Date.now
    },
    suggest_pos: {
        type: Number
    },
    file_path: {
        type: String
    },
    history: {
        type: Array 
    },
    watched: {
        type: Boolean
    }
})

const Movies = mongoose.model('Movies', moviesSchema);


module.exports = Movies;