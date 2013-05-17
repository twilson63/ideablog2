$http.get('/api/article/' + $routeParams.user + '/' + $routeParams.slug)
  .success(function(data) {
    $scope.article = data.rows[0].value;
    $scope.article.html = $markdown.toHTML($scope.article.body);
  });