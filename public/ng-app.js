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


angular.module('App').value('alerts', []);
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
//dashboard controller

angular.module('App').controller('DashboardCtrl', function($scope, $http, $location, $_) {

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
// home controller

angular.module('App').controller('HomeCtrl', function($scope, $routeParams, $http, $markdown, $_) {
  $scope.user = $routeParams.user;
  $http.get('/api/article/' + $routeParams.user + '/all/').success(function(data) {
    $scope.articles = $_(data.rows).pluck('value');
  });
});
app.filter('mdImage', function() {
  return function(input) {
    if (input) {
      return ['![',input.name, '](/uploads/',input.path,')'].join('');
    }
  };
});
angular.module('App').value('$moment', moment);
//Underscore moduler

angular.module('App').value('$_', _);

app.directive('uploadButton', function($parse, $compile) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<span class="upload-button {{class}}">' + '<span ng-transclude></span>' + '<input type="file">' + '</span>',
    link: function(scope, element, attrs) {
      element.find('input').bind('change', function() {
        var fd = new FormData();
        fd.append('uploadFile', this.files[0]);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(e) {
          var fn = $parse(attrs.complete);
          scope.$apply(function () {
            if(fn) { fn(scope, { $data: xhr.responseText, $status: xhr.status }); }
          });
        }, false);
        xhr.open("POST", attrs.action);
        xhr.send(fd);
      });
    }
  };
});