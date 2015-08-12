var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET posts page */
router.get('/posts', function(req, res, next){
  console.log("hi")
  Post.find(function(err, posts){
    if(err){ return next(err)}
    res.json(posts)
  })
})

router.post('/posts', function(req, res, next){
  var post = new Post(req.body);
  post.save(function(err, post){
    if(err){ return next(err)}
    res.json(post)
  })
})

router.param('post', function(req, res, next, id){
  console.log("id = ", id)
  var query = Post.findById(id);
  query.exec(function(err, post){
    if(err){ return next(err); }
    if(!post) { return next(new Error('can\'t find post'));}
    req.post = post;
    return next();
  })
})
//Now when we define a route URL with :post in it, the first thing that will happen is a query for that particular in the DB
//Assuming the :post parameter contains an ID, the function will retrieve the post object from the database and attach it to the req object after which the route handler function will be called.

router.get('/posts/:post', function(req,res, next){
  console.log("hi")
  //The populate mehtod automatically loads all the comments associated with the particular post
  req.post.populate('comments', function(err, post){
    if (err) { return next(err); }
    res.json(post)
  })
})

router.put('/posts/:post/upvote', function(req, res, next){
  req.post.upvote(function(err, post){
    if(err) { return next(err); }
    res.json(post)
  })
})

router.post('/posts/:post/comments', function(req, res, next){
  var comment = new Comment(req.body);
  comment.post = req.post // this comment's post is the post identified in the parameter

  comment.save(function(err, comment){
    if(err){ return next(err); }
    req.post.comments.push(comment); //for the post identified in the parameter, push this comment onto its comment array
    //we link the post to the comment (line 56) and the comment to the post (line 60)
    req.post.save(function(err, post){
      if(err){ return next(err); }
      res.json(comment)
    })
  })
})

router.param('comment', function(req, res, next, id){
  console.log("id = ", id)
  var query = Comment.findById(id);
  query.exec(function(err, comment){
    if(err){ return next(err); }
    if(!comment) { return next(new Error('can\'t find comment'));}
    req.comment = comment;
    return next();
  })
})

router.put('/posts/:post/comments/:comment/upvote', function(req, res, next){
  req.comment.upvote(function(err, comment){
    if(err) { return next(err); }
    res.json(comment)
  })
})

module.exports = router;

//55cab2a6bae40dfe48a66d36