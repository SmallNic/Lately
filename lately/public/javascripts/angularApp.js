// Because we added an external module, we need to be sure to include it as a dependency in our app
// ui-router is newer and provides more flexibility and features than ngRoute
var app = angular.module("lately", ['ui.router']);

// Now that we have ui-router included, we need to configure it. In our app.js, we're going to use the Angular config() function to setup a home state.
app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider){

    /* Here we set up our home route. The state is given a name ('home'), URL ('/home'), and template URL ('/home.html'). We've also told Angular that our new state should be controlled by MainCtrl. Finally, using the otherwise() method we've specified what should happen if the app receives a URL that is not defined */

    $stateProvider
      .state('home',{
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function (posts) {
            //what does the above 'posts' refer to? the service?
            return posts.getAll();
          }]
        }
      })

      .state('posts', {
        url: '/posts/{id}',  //'id' is actually a route parameter that will be made available to our controller.
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts){
            return posts.getOne($stateParams.id)
          }]
        }
      })

    $urlRouterProvider.otherwise('home')
  }
])


app.factory('posts', ['$http', function($http){
  var obj = {
    posts: [
      {title: 'post 1', upvotes: 1, comments:[]},
      {title: 'post 2', upvotes: 2, comments:[]},
      {title: 'post 3', upvotes: 3, comments:[]},
      {title: 'post 4', upvotes: 4, comments:[]},
      {title: 'post 5', upvotes: 5, comments:[]}
    ]
  };
  obj.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, obj.posts);
      //angular.copy() creates a deep copy of the returned data. This ensures that the $scope.posts variable in MainCtrl will also be updated, ensuring the new values are reflected in our view
      //it copies the data pulled from the DB into the Angular model/service
    })
  }
  obj.create = function(post){
    return $http.post('/posts', post).success(function(data){
      obj.posts.push(data);
      //grab the post that was just saved to the DB in the post call and add that to the angular model/service
    })
  }
  obj.upvote = function(post){
    return $http.put('/posts/' + post._id + '/upvote').success(function(data){
      post.upvotes += 1;
    })
  }
  obj.getOne = function(id) {
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    })
  }
  obj.addComment = function(id, comment){
    return $http.post('/posts/' + id + '/comments', comment);
  }
  obj.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote').success(function(data){
      comment.upvotes += 1;
    })
  }
  return obj
}])

app.controller('PostsCtrl', [
  '$scope',
  'posts', //This is called injecting the posts service (from our factory above). It is equivalent to obj
  'post', //The individual post
  function($scope, posts, post){
    //$scope.post = posts.posts[$stateParams.id] //= service.arrayName
    $scope.post = post;
    $scope.incrementUpvotes = function(comment){
      posts.upvoteComment(post, comment)
    }
    $scope.addComment = function(){
      if(!$scope.body || $scope.body === '') {return}
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user'
      }).success(function(comment){
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    }
  }
])

app.controller('MainCtrl', [
  '$scope',
  'posts', // this injects the post service into our controller so we can access its data
  function($scope, posts){
    $scope.test = 'Hello world!';
    $scope.posts = posts.posts; //does this set up two way data binding?
    /*any change or modification made to $scope.posts will be stored in the service and immediately accessible by any other module that injects the posts service.*/
    $scope.addPost = function(){
      if(!$scope.title || $scope.title ==='') {return}
      posts.create({
        title: $scope.title,
        link: $scope.link
      });
      $scope.title=''
      $scope.link=''
    }
    $scope.incrementUpvotes = function(post){
      posts.upvote(post)

    }
  },
])
