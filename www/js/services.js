angular.module('fitgx.services', [])

.factory('PercentageService', function() {
   var factory = {};
   
   factory.testmethod = function(a, b) {
      return a * b
   }
   
   return factory;
}); 