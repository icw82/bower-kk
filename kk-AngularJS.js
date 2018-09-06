'use strict';

(kk => {
//var name = 'kenzo';
var modules = ['ngCookies', 'ngResource'];

angular
    .module('kenzo', modules)
    .config(symbols)
    .config(['$resourceProvider', function($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])

symbols.$inject = ['$interpolateProvider'];
function symbols($interpolateProvider){
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
}

angular
    .module('kenzo')
    .filter('safe', ['$sce', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

angular
    .module('kenzo')
    .filter('capitalize', function() {
        return kk.capitalize;
    });

angular
    .module('kenzo')
    .filter('number', function() {
        return function(input) {
            if (kk.is.n(input) && input > 999)
                return kk.format.number(input)
            else
                return input
        };
    });

angular
    .module('kenzo')
    .filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

})(kk);
