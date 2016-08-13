/**
 * Listening the directive and add value on the front end.
 *
 * Example:
 *   Used to change the user's name on the front end.
 *   <span compile="username">Value</span>
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * AppCompile
 *
 * @type {angular.Module}
 */
var AppCompile = angular.module('meanstack.compile', []);

AppCompile.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.compile);
            },
            function(value) {
                element.html(value);

                $compile(element.contents())(scope);
            }
        );
    };
}]);
