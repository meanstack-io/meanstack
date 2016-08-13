/**
 * Gulp
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Export Gulp strategies.
 *
 * @type {{clean: *, script: *, style: *, copy: *, image: *, browserSync: initSingleton}}
 */
module.exports = {
    clean: require('./Clean'),
    script: require('./CompileScript'),
    style: require('./CompileStyle'),
    copy: require('./Copy'),
    image: require('./ImageMin'),
    browserSync: require('browser-sync')
};
