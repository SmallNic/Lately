var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
//JWT is a new token format used in space-constrained environments such as HTTP Authorization headers. JWT is architected as a method for transferring security claims based between parties

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique:true},
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(password){
    //this method accepts a password, then generates a salt and associated password hash
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    //pbkdf2Synch takes four params: password, salt, iterations, and key length
})

UserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex')
    return this.hash === hash;
}

UserSchema.methods.generateJWT = function(){
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    //why include today as a parameter in line 26?

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, 'SECRET');
};

mongoose.model('User', UserSchema)