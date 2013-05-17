// article edit controller

angular.module('App').controller('ArticleEditCtrl', function($scope, $http, $routeParams, $location) {

  $scope.mode = 'Edit';

  //get article to edit

  $http.get('/api/article/' + $routeParams.id).success(function(article) {
    $scope.article = article;
  })
  .error(function(err) {
    $location.path('/dashboard');
  });

  // save function

  $scope.save = function(article) {
    $http.put('/api/article/' + $routeParams.id, article).success(function(article) {
      $location.path('/dashboard');
    })
    .error(function(err) {
      // alert error
    });
  };

  $scope.cancel = function() {
    $location.path('/dashboard');
  };
});