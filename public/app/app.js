angular.module('App', ['ui.bootstrap', 'ui.codemirror', 'http-auth-interceptor'])
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', { controller: 'SignupCtrl', templateUrl: '/app/templates/signup.html'})
      .when('/dashboard', { controller: 'DashboardCtrl', templateUrl: '/app/templates/dashboard.html'})
      .when('/article/new', { controller: 'ArticleNewCtrl', templateUrl: '/app/templates/article-form.html'})
      .when('/:user', { controller: 'HomeCtrl', templateUrl: '/app/templates/home.html'})
      .when('/:user/:slug', { controller: 'ArticleCtrl', templateUrl: '/app/templates/article.html'})
      .when('/article/:id/edit', { controller: 'ArticleEditCtrl', templateUrl: '/app/templates/article-form.html'})
    ;
  });


// sign up controller and function from step 1.
// I added the login function here, not sure if that is correct

angular.module('App').controller('SignupCtrl', function($scope, $http, $location, $dialog) {
  
  $scope.login = function() {
    $dialog.dialog({
      backdrop: true,
      keyboard: false,
      backdropClick: false,
      dialogfade: true})
      .open('/app/templates/login.html', 'LoginCtrl');
  };

  $scope.register = function(user) {
    $http.post('/api/signup', user)
      .success(function(user) {
        $location.path('/dashboard');
      })
      .error(function(err) {
      });
  };
});

// login controller

angular.module('App').controller('LoginCtrl', function($scope, $http, $location, authService, dialog) {
  $scope.login = function(user) {
    $http.post('/api/login', user)
    .success(function(user) {
      dialog.close();
      //alerts.push({type: 'success', msg : 'Successfully logged in.'});
      authService.loginConfirmed();
    })
    .error(function(err) {
      //alert error
    });
  };
});


// markdown services, no idea where they go

angular.module('App').value('$markdown');

