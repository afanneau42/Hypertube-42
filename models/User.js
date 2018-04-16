var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: true        
    },
    firstname: {
        type: String,
        lowercase: true        
    },
    lastname: {
        type: String, 
        lowercase: true
              
    },
    email: {
        type: String,
        match: /[^@]+@[^@]+/,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        //required: true
    },
    picture: {
        type: String,
    },
    language: {
        type: String,
    },
    history: {
        type: String,
    },
    twitterid: {
        type: String,
    },
    fortytwoid: {
        type: String,
    },
    githubid: {
        type: String,
    },
    facebookid: {
        type: String,
    },
    googleid: {
        type: String,
    },
    dropboxid:{
        type: String,
    },
    linkedinid:{
        type: String,
    },
    provider:{
        type: String,
        required: true        
    },
});
mongoose.plugin(findOrCreate);
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
