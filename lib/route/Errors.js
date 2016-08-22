/**
 * Error pages
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Errors
 *
 * @param Router
 * @return {Router}
 */
var Errors = function (Router) {
    var router = Router();

    // Error pages.
    router.use('/error',
        Router().get('/404', function (req, res) {
            res.render('error/404');
        }),

        Router().get('/403', function (req, res) {
            res.render('error/403');
        }),

        Router().get('/500', function (req, res) {
            res.render('error/500');
        })
    );

    // Send code status 404.
    router.use(function (req, res) {
        res.sendStatus(404);
    });

    return router;
};

module.exports = Errors;
