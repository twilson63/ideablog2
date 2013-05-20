// article-new controller

angular.module('App').controller('ArticleNewCtrl', 
  function($scope, $location, $http, $moment, $routeParams) {
  // create new article function

$http.get('/api/article/' + $routeParams.user + '/' + $routeParams.slug)
  .success(function(data) {
    $scope.article = data.rows[0].value;
    $scope.article.html = $markdown.toHTML($scope.article.body);
  });

});