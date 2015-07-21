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
        controller: 'MainCtrl'
      })

      .state('posts', {
        url: '/posts/{id}',  //'id' is actually a route parameter that will be made available to our controller.
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
      })

    $urlRouterProvider.otherwise('home')
  }
])


app.factory('posts', [function(){
  var obj = {
    posts: [
      {title: 'post 1', upvotes: 1},
      {title: 'post 2', upvotes: 2},
      {title: 'post 3', upvotes: 3},
      {title: 'post 4', upvotes: 4},
      {title: 'post 5', upvotes: 5}
    ]
  };
  return obj
}])

app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  function($scope, $stateParams, posts){
    $scope.post = posts.posts[$stateParams.id]
    $scope.incrementUpvotes = function(comment){
      comment.upvotes++

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
      $scope.posts.push({
        title:$scope.title,
        link:$scope.link,
        upvotes:0,
        comments: [
          {author: "Joe", body: "Cool post!", upvotes:0 },
          {author: "Bob", body: "Great idea  but everything is wrong!", upvotes: 0}
        ]
      });
      $scope.title=''
      $scope.link=''
    }
    $scope.incrementUpvotes = function(post){
      post.upvotes++

    }
  },
])
