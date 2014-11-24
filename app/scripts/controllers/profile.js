'use strict';


app.controller('ProfileCtrl', ['$scope', '$routeParams', 'Post', "User", function($scope, $routeParams, Post, User) {
  $scope.user = User.findByUsername($routeParams.username);
  $scope.posts = {};
  $scope.commentedPosts = {};
  $scope.comments = {};

  $scope.user.$on('loaded', function() {
    populatePosts();
    populateComments();
  });

  // function populatePosts() {
  //   $scope.posts = {};
  //
  //   angular.forEach($scope.user.posts, function(postId) {
  //     $scope.posts[postId] = Post.find(postId);
  //   });
  // }
  //
  // function populateComments () {
  //   $scope.comments = {};
  //
  //   angular.forEach($scope.user.comments, function (comment) {
  //     var post = Post.find(comment.postId);
  //
  //     post.$on('loaded', function () {
  //       $scope.comments[comment.id] = post.$child('comments').$child(comment.id);
  //
  //       $scope.commentedPosts[comment.postId] = post;
  //     });
  //   });
  // }

  function populatePosts () {
      var posts = User.posts($routeParams.username).$asArray();

      posts.$loaded(function () {
        angular.forEach(posts, function (post){
          $scope.posts[post.$id] = Post.find(post.$id);
        });
      });
    }

    function populateComments () {
      var comments = User.comments($routeParams.username).$asArray();

      comments.$loaded(function () {
        angular.forEach(comments, function (comment) {
          var post = Post.find(comment.$value);

          post.$loaded(function () {
            var postComments = Post.comments(comment.$value).$asObject();

            postComments.$loaded(function () {
              $scope.commentedPosts[comment.$id] = post;
              $scope.comments[comment.$id] = postComments[comment.$id];
            });
          });
        });
      });
    }
}]);

// 'use strict';
//
// app.controller('ProfileCtrl', function($scope, $routeParams, Profile){
//   var uid = $routeParams.userId;
//
//   $scope.profile = Profile.get(uid);
//   Profile.getPosts(uid).then(function(posts){
//     $scope.posts = posts;
//   });
// });
