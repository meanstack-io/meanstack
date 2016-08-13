/**
 * Fetch random document(s) from your mongoose collections.
 *
 * Example:
 *   Model.paginate([query], [options], [callback])
 *   Model.random([query], [options], [callback])
 *
 * Parameters:
 *   [query] {Object} - Query criteria. Documentation: https://docs.mongodb.org/manual/tutorial/query-documents
 *     [options] {Object}
 *       [select] {Object | String} - Fields to return. Documentation: http://mongoosejs.com/docs/api.html#query_Query-select
 *       [limit] {Number} - Range of documents the query will return. Documentation: http://mongoosejs.com/docs/api.html#query_Query-limit
 *       [populate] {Array | Object | String} - Paths which should be populated with other documents. Documentation: http://mongoosejs.com/docs/api.html#query_Query-populate
 *
 * Return promise.
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Random
 *
 * @return {Promise}.
 */
function Random() {
    var schema = this,
        arg = arguments,
        query = {},
        options = {},
        callback;

    Object.keys(arg).forEach(function (index) {
        var elm = arg[index];
        if (typeof elm === 'function') {
            callback = elm;
        } else if (index == 0) {
            query = elm;
        } else if (index == 1) {
            options = elm;
        }
    });

    var count = schema.count(query).exec();

    return count.then(function (count) {
        return Math.floor(Math.random() * count);

    }).then(function (skip) {
        var doc = schema.findOne(query)
            .select(options.select)
            .skip(skip)
            .limit(options.limit);

        if (options.populate) {
            [].concat(options.populate).forEach(function (item) {
                doc.populate(item);
            });
        }

        return doc.exec();
    }).asCallback(callback);
}

/**
 * Adding static method random.
 *
 * @param {Schema} schema
 */
module.exports = function (schema) {
    schema.statics.random = Random;
};

module.exports.random = Random;
