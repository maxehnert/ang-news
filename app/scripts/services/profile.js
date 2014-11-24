'use strict';

app.factory('User', ['$scope', '$firebase', 'FIREBASE_URL', 'Auth', '$rootScope', function ($scope, $firebase, FIREBASE_URL, Auth, $rootScope) {
  var ref = new Firebase(FIREBASE_URL + 'users');

  var users = $firebase(ref);

  var User = {
    create: function (authUser, username) {
      var user = $firebase(ref.child(username)).$asObject();

      return user.$loaded(function () {
        user.username = username;
        user.md5_hash = authUser.md5_hash;
        user.$priority = authUser.uid;
        user.$save();
      });
    },
    findByUsername: function (username) {
      if (username) {
        return $firebase(ref.child(username)).$asObject();
      }
    },
    getCurrent: function () {
      return $rootScope.currentUser;
    },
    signedIn: function () {
      return $rootScope.currentUser !== undefined;
    }

  };
  function setCurrentUser (username) {
    $rootScope.currentUser = User.findByUsername(username);
  };
  $rootScope.$on('$firebaseSimpleLogin:login', function (e, authUser) {
    var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid)).$asArray();

    query.$loaded(function () {
      setCurrentUser(query[0].username);
    });
  });
  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    delete $rootScope.currentUser;
  });


  return User;
}]);







// app.factory('User', function ($firebase, FIREBASE_URL, Auth, $rootScope) {
//   var ref = new Firebase(FIREBASE_URL + 'users');
//   var users = $firebase(ref);
//
//   var User = {
//     create: function (authUser, username) {
//
//       users.$update(username, {
//         md5_hash: authUser.md5_hash,
//         username: username,
//         priority: authUser.uid
//       });
//
//     },
// // app.factory('User', function($firebase, FIREBASE_URL, $rootScope) {
// //   var ref = new Firebase(FIREBASE_URL + 'users');
// //   var users = $firebase(ref);
// //
// //   var User = {
// //     create: function(authUser, username) {
// //       users[username] = {
// //         md5_hash: authUser.md5_hash,
// //         username: username,
// //         '$priority': authUser.uid
// //       };
// //
// //       users.$save(username).then(function() {
// //         setCurrentUser(username);
// //       });
// //     },
//     findByUsername: function(username) {
//       if (username) {
//         return users.$child(username);
//       }
//     },
//     getCurrent: function () {
//       return $rootScope.currentUser;
//     },
//     signedIn: function () {
//       return $rootScope.currentUser !== undefined;
//     }
//   };
//
//   function setCurrentUser(username) {
//     $rootScope.currentUser = User.findByUsername(username);
//   }
//
//   $rootScope.$on('$firebaseSimpleLogin:login', function(e, authUser) {
//     // var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));
//     var query = $firebase(ref).$asObject();
//     query.$loaded(function(result){
//       angular.forEach(result, function(key){
//         if(key.md5_hash === authUser.md5_hash){
//           setCurrentUser(key);
//         }
//       });
//     });
//
//     // query.$on('loaded', function() {
//     //   setCurrentUser(query.$getIndex()[0]);
//     // });
//   });
//
//   $rootScope.$on('$firebaseSimpleLogin:logout', function() {
//     delete $rootScope.currentUser;
//   });
//
//   return User;
// });

// 'use strict';
//
// app.factory('Profile', function ($window, FIREBASE_URL, $firebase, Post, $q) {
//   var ref = new $window.Firebase(FIREBASE_URL);
//
//   var profile = {
//     get: function (userId) {
//       return $firebase(ref.child('profile').child(userId)).$asObject();
//     },
//     getPosts: function(userId) {
//       var defer = $q.defer();
//
//       $firebase(ref.child('user_posts').child(userId))
//         .$asArray()
//         .$loaded()
//         .then(function(data) {
//           var posts = {};
//
//           for(var i = 0; i<data.length; i++) {
//             var value = data[i].$value;
//             posts[value] = Post.get(value);
//           }
//           defer.resolve(posts);
//         });
//
//       return defer.promise;
//     }
//   };
//
//   return profile;
// });
