angular.module('DataNexus', ['ui.router', 'nvd3', 'ngBootbox'])
  .config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');
    $stateProvider

    .state('landing', {
      url: '/',
      views: {
          "": {
            templateUrl: 'templates/landing.html',
          },
          "navbarLoggedOut@landing": {
            templateUrl: 'templates/navbarLoggedOut.html',
            controller: 'LoginController'
          }
        }
    })

    .state('signup', {
      templateUrl: 'templates/signup.html',
      controller: 'SignupController',
      url: '/signup'
    })

    .state('configure', {
      url: '/configure/:project',
      views: {
          '': {
            templateUrl: 'templates/configure.html',
            controller: 'ConfigureController'
          },
          "navbarLoggedIn@configure": {
            templateUrl: 'templates/navbarLoggedIn.html',
            controller: 'LoginController'
          },
          "configureProjects@configure": {
            templateUrl: 'templates/configureProjects.html',
            controller: 'ConfigureControllerProjects'
          },
          "configureList@configure": {
            templateUrl: 'templates/configureList.html',
            controller: 'ConfigureControllerList'
          },
          // "configureDetails@configure": {
          //   templateUrl: 'templates/configureDetails.html',
          //   controller: 'ConfigureControllerList'
          //   // controller: 'ConfigureControllerDetails'
          // }
        }
    })

    .state('monitor', {
      url: '/monitor/:project',
      views: {
        '': {
          templateUrl: 'templates/monitor.html',
          controller: 'MonitorController'
        },
        "navbarLoggedIn@monitor": {
          templateUrl: 'templates/navbarLoggedIn.html',
          controller: 'LoginController'
        },
        "monitorProjects@monitor": {
          templateUrl: "templates/monitorProjects.html",
          controller: 'MonitorController'
        },
        "monitorGraphs@monitor": {
          templateUrl: "templates/monitorGraphs.html",
          controller: 'MonitorController'
        }
      }
    })

    .state('alerts', {
      url: '/alerts/:project',
      views: {
        '': {
          templateUrl: 'templates/alerts.html',
          controller: 'AlertsController'
        },
        "navbarLoggedIn@alerts": {
          templateUrl: 'templates/navbarLoggedIn.html',
          controller: 'LoginController'
        },
        "alertProjects@alerts": {
          templateUrl: "templates/alertProjects.html",
          // controller: 'MonitorController'
        },
        "alertList@alerts": {
          templateUrl: "templates/alertList.html",
          controller: 'alertListController'
        }
      }
    })

  });
