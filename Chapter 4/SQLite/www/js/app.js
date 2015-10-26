var app = angular.module('starter', ['ionic', 'ngCordova']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/layout.html",
    controller: 'MainCtrl'
  })
    .state('app.users', {
      url: "/users",
      views: {
        'main': {
          templateUrl: "templates/users.html",
          controller: "UsersCtrl"
        }
      }
    })
    .state('app.groups', {
      url: "/groups",
      views: {
        'main': {
          templateUrl: "templates/groups.html"
        }
      }
    });

  $urlRouterProvider.otherwise('/app/users');
});

app.controller('MainCtrl', function($scope, $rootScope, MyData) {
  $scope.users = MyData.users;
  $scope.groups = MyData.groups;

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) { 
    if (toState.name == 'app.groups') {
      getGroups();
    }
  });

  function getGroups() {
    MyData.getGroupsAll().then(function(res) {
      var newGroups = [];
      for (var i=0; i<res.rows.length; i++) {
        newGroups[i] = {
          id: res.rows.item(i).id,
          name: res.rows.item(i).name,
          users: []
        };
        var userIds = res.rows.item(i).userIds ? res.rows.item(i).userIds.split(',') : [];
        for (var j=0; j<userIds.length; j++) {
          var name = '';
          for (var t=0; t<$scope.users.length; t++) {
            if ($scope.users[t].id == userIds[j])
              name = $scope.users[t].name
          }
          newGroups[i].users.push({
            id: userIds[j],
            name: name
          });
        }
      }

      if (newGroups.length < $scope.groups.length) {
        for (var o=0; o<$scope.groups.length; o++) {
          var doesExist = false;
          for (var n=0; n<newGroups.length; n++) {
            doesExist = doesExist || (newGroups[n].id == $scope.groups[o].id);
          }
          if (!doesExist) {
            newGroups.push({
              id: $scope.groups[o].id,
              name: $scope.groups[o].name,
              users: []
            });
          }
        }
      }
      angular.copy(newGroups, $scope.groups);
    });
  }
});

app.controller('UsersCtrl', function($scope, $timeout, $ionicModal, $cordovaSQLite, MyData) {
  $scope.newUser = {};

  $ionicModal.fromTemplateUrl('templates/userModal.html', {
    scope: $scope,
    animation: 'fade-in'
  }).then(function(modal) {
    $scope.userModal = modal;
  });

  $scope.openUserModal = function(user) {
    $scope.user = user || {};
    $scope.usergroup = [];
    if ((user) && (angular.isObject(user)) && (user.hasOwnProperty('id'))) {
      $scope.user.groups = [];
      MyData.getGroupsByUserId(user.id).then(function(res) {
        for (var i=0; i<res.rows.length; i++) {
          $scope.user.groups.push(res.rows.item(i).groupId);
        }
        for (var i=0; i<$scope.groups.length; i++) {
          $scope.usergroup.push($scope.user.groups.indexOf($scope.groups[i].id) >= 0);
        }
      });
    }

    $scope.userModal.show();
  };

  $scope.addUser = function() {
    MyData.addUser($scope.newUser.name).then(function(res) {
      $scope.users.push({
        id: res.insertId,
        name: $scope.newUser.name
      });
      $scope.newUser.name = '';
    });
  }

  $scope.save = function(user, usergroup) {
    var usergroups = [];
    for (var i=0; i<$scope.groups.length; i++) {
      if (usergroup[i]) {
        usergroups.push([user.id, $scope.groups[i].id]);
      }
    }

    MyData.updateGroupByUserId(user.id, usergroups).then(function(res) {
    });

    $scope.userModal.hide();
  };

  $scope.cancel = function() {
    $scope.userModal.hide();
  };

});

app.factory('MyData', function($ionicPlatform, $cordovaSQLite, $q) {
  var db = {}, 
      users = [], 
      groups = [], 
      usergroup = [];

  var initdb = {
    users: ["User A", "User B", "User C", "User D", "User E"],
    groups: ["Group 1", "Group 2", "Group 3"]
  };

  var createUsers = function() {
    $cordovaSQLite.nestedExecute(db, 
      'CREATE TABLE IF NOT EXISTS users (id integer primary key, name text)',
      'INSERT INTO users (name) VALUES (?),(?),(?),(?),(?)',
      [],
      initdb.users
      ).then(function(res) {

      $cordovaSQLite.execute(db, 'SELECT * FROM users').then(function(res) {

        for (var i=0; i<res.rows.length; i++) {
          users.push(res.rows.item(i));
        }

      }, function (err) {
        console.error(err);
      });

    }, function (err) {
      console.error(err);
    });
  };

  var createGroups = function() {
    $cordovaSQLite.nestedExecute(db, 
      'CREATE TABLE IF NOT EXISTS groups (id integer primary key, name text)',
      'INSERT INTO groups (name) VALUES (?),(?),(?)',
      [],
      initdb.groups
      ).then(function(res) {

      $cordovaSQLite.execute(db, 'SELECT * FROM groups').then(function(res) {

        for (var i=0; i<res.rows.length; i++) {
          groups.push(res.rows.item(i));
        }

      }, function (err) {
        console.error(err);
      });

    }, function (err) {
      console.error(err);
    });
  }

  $ionicPlatform.ready(function() {
    db = $cordovaSQLite.openDB("my.db", 1);

    $cordovaSQLite.execute(db, 'DROP TABLE IF EXISTS users').then(function(res) {
      createUsers();
    }, function (err) {
      console.error(err);
    });

    $cordovaSQLite.execute(db, 'DROP TABLE IF EXISTS groups').then(function(res) {
      createGroups();
    }, function (err) {
      console.error(err);
    });
    
    $cordovaSQLite.execute(db, 'DROP TABLE IF EXISTS usergroup').then(function(res) {
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS usergroup (id integer primary key, userId integer, groupId integer)').then(function(res) {
      }, function (err) {
        console.error(err);
      });

    }, function (err) {
      console.error(err);
    });

  });

  return {
    users: users,
    groups: groups,
    getGroupsByUserId: function(userId) {
      var q = $q.defer();
      var query = "SELECT groupId FROM usergroup WHERE userId = (?)";
      $cordovaSQLite.execute(db, query, [userId]).then(function(res) {
        q.resolve(res);
      }, function (err) {
        console.error(err);
        q.reject(err);
      });

      return q.promise; 
    },
    getGroupsAll: function() {
      var q = $q.defer();
      var query = "SELECT groups.id, groups.name, GROUP_CONCAT(usergroup.userId) AS userIds FROM groups LEFT OUTER JOIN usergroup ON groups.id = usergroup.groupId GROUP BY usergroup.groupId";
      $cordovaSQLite.execute(db, query).then(function(res) {
        q.resolve(res);
      }, function (err) {
        q.reject(err);
      });

      return q.promise; 
    },
    addUser: function(params) {
      var q = $q.defer();
      var query = "INSERT INTO users (name) VALUES (?)";
      $cordovaSQLite.execute(db, query, [params.name]).then(function(res) {
        q.resolve(res);
      }, function (err) {
        console.error(err);
        q.reject(err);
      });

      return q.promise; 
    },
    updateGroupByUserId: function(userId, usergroups) {
      var q = $q.defer();
      var query = "DELETE FROM usergroup WHERE userId = (?)";
      $cordovaSQLite.execute(db, query, [userId]).then(function(res) {
        var query = "INSERT INTO usergroup (userId, groupId) VALUES (?,?)";
        $cordovaSQLite.insertCollection(db, query, usergroups).then(function(res) {
          q.resolve(res);
        }, function (err) {
          console.error(err);
          q.reject(err);
        });

      }, function (err) {
        console.error(err);
        q.reject(err);
      });

      return q.promise; 
    }
  }
});