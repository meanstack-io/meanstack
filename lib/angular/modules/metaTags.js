/**
 * Module metaTags.
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2017, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

/**
 * AppMetaTags
 *
 * @type {angular.Module}
 */
var AppMetaTags = angular.module('meanstack.metaTags', []);

AppMetaTags.provider('metaTags', [function () {

    'use strict';

    var settings = {
        'title': {
            'type': 'title'
        },
        'description': {
            'type': 'metaName'
        },
        'robots': {
            'type': 'metaName'
        },
        'keywords': {
            'type': 'metaName'
        },
        'canonical': {
            'type': 'linkRel',
            'default': 'currentUrl'
        }
    };

    //metaName, metaProperty, linkRel, title, helper.
    var types = {
        'title': {
            'get': 'head title',
            'set': '<title>:value</title>'
        },
        'metaName': {
            'get': 'head [name=":tag"]',
            'set': '<meta name=":tag" content=":value" />'
        },
        'metaProperty': {
            'get': 'head [property=":tag"]',
            'set': '<meta property=":tag" content=":value" />'
        },
        'linkRel': {
            'get': 'head link[rel=":tag"]',
            'set': '<link rel=":tag" href=":value" />'
        }
    };

    /**
     * Function helper: currentUrl
     *
     * @param $state
     * @return {*}
     */
    function currentUrl($state) {
        return $state.href($state.current.name, {}, {absolute: true});
    }

    /**
     * defaultValue
     * call functions helpers
     *
     * @param tagsCurrent
     * @param $state
     * @return {*}
     */
    function defaultValue(tagsCurrent, $state) {

        Object.keys(tagsCurrent).forEach(function (key) {

            if (typeof tagsCurrent[key].default !== 'undefined') {

                // functions helpers
                if (tagsCurrent[key].default === 'currentUrl') {
                    tagsCurrent[key].value = currentUrl($state);
                }
            }
        });

        return tagsCurrent;
    }

    /**
     * setCurrent
     * Set value to current tags.
     *
     * @param tagsCurrent
     * @param tags
     * @return {*}
     */
    function setCurrent(tagsCurrent, tags) {
        Object.keys(tags).forEach(function (key) {
            var prefixAfter = tagsCurrent[key].prefixAfter || '',
                prefixBefore = tagsCurrent[key].prefixBefore || '';

            tagsCurrent[key].value = prefixAfter + tags[key] + prefixBefore;
        });

        return tagsCurrent;
    }

    /**
     * setReference
     * Populate references fields.
     *
     * @param tagsCurrent
     * @param tags
     * @return {*}
     */
    function setReference(tagsCurrent, tags) {
        tags = tags || tagsCurrent;

        var keysCustom = Object.keys(tags);

        var keysEdit = Object.keys(tagsCurrent).filter(function (key) {
            return keysCustom.indexOf(tagsCurrent[key].reference) !== -1;
        });

        keysEdit.forEach(function (key) {
            if (typeof tagsCurrent[tagsCurrent[key].reference].value !== 'undefined') {
                tagsCurrent[key].value = tagsCurrent[tagsCurrent[key].reference].value;
            }
        });

        return tagsCurrent;
    }

    /**
     * emptyValue
     *
     * @param tagData
     * @return {boolean}
     */
    function emptyValue(tagData) {
        return (typeof tagData.value === 'undefined' || tagData.value === null || tagData.value === '');
    }

    /**
     * escapeHtml
     * Escape html to append tags.
     *
     * @param unsafe
     * @return {*}
     */
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * appendMetaTag
     * Append meta tags
     *
     * @param tag
     * @param tagData
     */
    function appendMetaTag(tag, tagData) {

        var tagType = types[tagData.type];

        // if type not found
        if (typeof tagType === 'undefined') {
            return;
        }

        // Remove tags
        angular.element(
            (tagType.get).replace(':tag', tag)
        ).remove();

        // if value undefined or null not add tag.
        if (emptyValue(tagData)) {
            return;
        }

        angular.element('head').append(
            ((tagType.set).replace(':tag', tag)).replace(':value', escapeHtml(tagData.value))
        );
    }

    /**
     * metaTags
     *
     * @param tagsCurrent
     */
    function metaTags(tagsCurrent) {
        Object.keys(tagsCurrent).forEach(function (tag) {
            appendMetaTag(tag, tagsCurrent[tag]);
        });
    }

    /**
     * Config module
     *
     * @param tagSettings
     */
    this.config = function (tagSettings) {
        settings = angular.merge({}, settings, tagSettings);
    };

    this.$get = ['$rootScope', '$state', function ($rootScope, $state) {
        var service = {};

        $rootScope.tagsCurrent = {};

        /**
         * setCurrent
         *
         * @param tags
         * @param callSetReference
         */
        service.setCurrent = function (tags, callSetReference) {
            callSetReference = callSetReference || true;

            $rootScope.tagsCurrent = setCurrent($rootScope.tagsCurrent, tags);

            if (callSetReference) {
                $rootScope.tagsCurrent = setReference($rootScope.tagsCurrent, tags);
            }

            metaTags($rootScope.tagsCurrent);
        };

        /**
         * Watch state change to angular-router-ui.
         *
         * "populate: false" not call helpers.
         *   - defaultValue
         *   - setReference
         *
         * $stateProvider.state('home', {
         *      url: '/',
         *      templateNamespace: 'home',
         *      data: {
         *          title: 'MEANStack.io - Facilitating the development offering the best of MEAN',
         *          description: 'MEANStack.io bringing together the best of MEAN MongoDB, Express, AngularJS and Node.js',
         *          populate: false // if helpers false not call helpers.
         *      },
         * ...
         */
        service.watch = function () {
            $rootScope.$on('$stateChangeSuccess', function (event, toState) {

                $rootScope.tagsCurrent = setCurrent(settings, (toState.data || {}));

                if (toState.data && toState.data.populate !== false) {

                    $rootScope.tagsCurrent = defaultValue($rootScope.tagsCurrent, $state);
                    $rootScope.tagsCurrent = setReference($rootScope.tagsCurrent);
                }

                metaTags($rootScope.tagsCurrent);
            });
        };

        return service;
    }];
}]);

/**
 * Run watch.
 */
AppMetaTags.run(['metaTags', function (metaTags) {
    metaTags.watch();
}]);
