var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
})

PostSchema.methods.upvote = function(callback){
  this.upvotes += 1;
  console.log("cb =", callback);
  this.save(callback);
}


//The following registers the model with the global mongoose object we imported using require() so that it can be used to interact with the database anywhere else mongoose is imported.
mongoose.model('Post', PostSchema)
