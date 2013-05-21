//dashboard controller

App.controller('DashboardCtrl', function($scope, $http, $location, $_) {

  $http.get('/api/article').success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });

  $scope.logout = function() {
    $http.post('/api/logout').success(function(data) {
      alerts.push({type: 'success', msg: 'Successfully logged out.'});
      $location.path('/');
    });
  };

//gets username

  $scope.mode = 'New';
  $http.get('/api/session').success(function(data) {
    $scope.article.author = data.user;
  });

  // This function saves newly created posts.  It should also alert the user that
  //  the item was saved correctly.  It should also return the user to the dashboard

  $scope.save = function(article) {
    article.type = 'article';
    article.slug = article.title.toLowerCase().replace(' ', '-');
    $http.post('/api/article', article).success(function(article) {
      //alert success
      $location.path('/dashboard');
      alerts.push({type: 'error', msg: 'Error: ' + err.error + '!'});
    });
  };

// If user selects cancel option they should be returned to the dashboard

  $scope.cancel = function () {
    $location.path('/dashboard');
  };


});