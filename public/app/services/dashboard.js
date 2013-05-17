//dashboard controller

app.controller('DashboardCtrl', function($scope, $http, $location, $_) {

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

  $scope.save = function(article) {
    article.type = 'article';
    article.slug = article.title.toLowerCase().replace(' ', '-');
    $http.post('/api/article', article).success(function(article) {
      //alert success
      $location.path('/dashboard');
      alerts.push({type: 'error', msg: 'Error: ' + err.error + '!'});
    });
  };

// not sure it looks like it cancels?

  $scope.cancel = function () {
    $location.path('/dashboard');
  };


});