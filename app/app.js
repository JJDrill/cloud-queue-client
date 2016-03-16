angular.module('DataNexus', ['ui.router', 'nvd3'])
  .config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');

    $stateProvider

    .state('landing', {
      templateUrl: 'templates/landing.html',
      controller: 'LandingController',
      url: '/'
    })

    .state('configure', {
      url: '/configure/:project',
      views: {
          '': {
            templateUrl: 'templates/configure.html',
            controller: 'ConfigureController'
          },
          "configureProjects@configure": {
            templateUrl: 'templates/configureProjects.html',
            // controller: 'ConfigureController'
          },
          "configureDetails@configure": {
            templateUrl: 'templates/configureDetails.html',
            controller: 'ConfigureControllerDetails'
          }
        }
    })

    .state('security', {
      templateUrl: 'templates/security.html',
      controller: 'SecurityController',
      url: '/security'
    })

    .state('monitor', {
      url: '/monitor/:project',
      views: {
        '': {
          templateUrl: 'templates/monitor.html',
          controller: 'MonitorController'
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

  });
