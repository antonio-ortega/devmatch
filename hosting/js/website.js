angular.module('website', ['ngRoute']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/about', {templateUrl: 'partials/about.html', controller: 'AboutCtrl'}).
            when('/experiments', {templateUrl: 'partials/experiments.html', controller: 'ExperimentsCtrl'}).
            when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'}).
			      when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'}).
            otherwise({redirectTo: '/login'});
    })
    .controller('LoginCtrl', function ($scope, $location, StateService) {
        $scope.title = 'Login Page';
        $scope.body = 'This is the login page body';

    		$scope.login = function () {
    			console.log("Login");
    		}

    		$scope.customSubmit = function() {
    			var email = document.querySelector("input[name = email]").value
    			var pass = document.querySelector("input[name = pass]").value
    			var description = document.querySelector("input[name = description]").value

    			console.log("pre")
    			WeDeploy
    			.data('http://db.devmatch-web.wedeploy.me')
    			.create('user', {
    				"email": email,
    				"password": pass,
    				"enterprise": false,
    				"description": description
    			}).then(function(user) {
    				console.log(user);
    			});
    			return false
    		}

  		  $scope.login = function () {

            WeDeploy
                .data('http://db.devmatch-web.wedeploy.me')
                .match('email', $scope.username)
                .match('password', $scope.password)
                .get('user')
                .then(function(users) {
                    if(users.length == 0) {
                        alert("User not registered");
                        return;
                    }
                    
                    user = JSON.stringify(users[0]);
					setCookie("user", user, 2);
					
                    $location.path('/home');
                });
  		  }

        $scope.message = StateService.getMessage();

        $scope.updateMessage = function (m) {
            StateService.setMessage(m);
        };
    })
    .controller('AboutCtrl', function ($scope, StateService) {
        $scope.title = 'About Page';
        $scope.body = 'This is the about page body';

        $scope.message = StateService.getMessage();

        $scope.updateMessage = function (m) {
            StateService.setMessage(m);
        };
    })
    .controller('ExperimentsCtrl', function ($scope, StateService, ExperimentsService) {
        $scope.title = 'Experiments Page';
        $scope.body = 'This is the about experiments body';

        $scope.message = StateService.getMessage();
        $scope.experiments = ExperimentsService.getExperiments();

        $scope.updateMessage = function (m) {
            StateService.setMessage(m);
        };
    })
    .controller('HomeCtrl', function ($scope, StateService) {
        $scope.title = 'Home Page';
        $scope.body = 'This is the about home body';

        $scope.message = StateService.getMessage();

        $scope.updateMessage = function (m) {
            StateService.setMessage(m);
        };
    })
    .factory('StateService', function () {
        var message = 'Hello Message';
        var getMessage = function () {
            return message;
        };
        var setMessage = function (m) {
            message = m;
        };

        return {
            getMessage: getMessage,
            setMessage: setMessage
        }
    })
    .service('ExperimentsService', function () {
        var service = this,
            experiments = [
                {name: 'Experiment 1', description: 'This is an experiment', completed:0},
                {name: 'Experiment 2', description: 'This is an experiment', completed:0},
                {name: 'Experiment 3', description: 'This is an experiment', completed:0},
                {name: 'Experiment 4', description: 'This is an experiment', completed:0}
            ];

        service.getExperiments = function() {
            return experiments;
        };
    })
    .directive('experiment', function(){
        var linker = function (scope, element, attrs) {
            element.on('click', function(){
                scope.doExperiment();
            })
        };

        var controller =  function($scope){
            $scope.doExperiment = function() {
                $scope.$apply(function(){
                    $scope.experiment.completed++;
                });
            };
        };

        return {
            scope: true,
            restrict: 'E',
            template: '<div class="experiment">' +
                '<h3>{{experiment.name}}</h3>' +
                '<p>{{experiment.description}}</p>' +
                '<p><strong>{{experiment.completed}}</strong></p>' +
                '</div>',
            link: linker,
            controller: controller
        }
    });
