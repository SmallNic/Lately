var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: Number, default:0},
  post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
})
//In Mongoose, we can create relationships sbetween different data models using the ObjectID type. The ObjectId data type refers to a 12 byte MongoDB ObjectId, which is stored in the DB.
//The ref property tells Mongoose what type of object the ID references and enables us to retrieve both items simultaneously


CommentSchema.methods.upvote = function(callback){
  this.upvotes += 1;
  console.log("cb =", callback);
  this.save(callback);
}

mongoose.model('Comment', CommentSchema);
