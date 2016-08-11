// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('fitgx', ['ionic', 'fitgx.controllers', 'fitgx.services', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.factory ('StorageService', function ($localStorage) {

  $localStorage = $localStorage.$default({
    things: []
  });

  var _getAll = function () {
    return $localStorage.things;
  };

  var _add = function (thing) {
    $localStorage.things.push(thing);
  }

  var _remove = function (thing) {
    $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
  }

  return {
    getAll: _getAll,
    add: _add,
    remove: _remove
  };
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.overview', {
    url: '/overview',
    views: {
      'tab-overview': {
        templateUrl: 'templates/tab-overview.html',
        controller: 'OverviewCtrl'
      }
    }
  })

  .state('tab.data', {
      url: '/data',
      views: {
        'tab-data': {
          templateUrl: 'templates/tab-data.html',
          controller: 'DataCtrl'
        }
      }
    })

   .state('tab.intake', {
      url: '/data/intake',
      views: {
        'tab-data': {
          templateUrl: 'templates/intake.html',
          controller: 'IntakeCtrl'
        }
      }
    })

      .state('tab.exercise', {
      url: '/data/exercise',
      views: {
        'tab-data': {
          templateUrl: 'templates/exercise.html',
          controller: 'ExerciseCtrl'
        }
      }
    })

      .state('tab.alcohol', {
      url: '/data/alcohol',
      views: {
        'tab-data': {
          templateUrl: 'templates/alcohol.html',
          controller: 'AlcoholCtrl'
        }
      }
    })



    .state('tab.graphs', {
      url: '/graphs',
      views: {
        'tab-graphs': {
          templateUrl: 'templates/tab-graphs.html',
          controller: 'GraphCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/overview');

});

