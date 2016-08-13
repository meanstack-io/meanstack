/**
 * Response
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Response
 *   Module to standardize responses.
 *
 * @constructor
 */
var Response = function () {

    /**
     * @private
     * @type {{success: boolean, msg: Array, data: {}}}
     */
    var val = {
        success: false,
        msg: [],
        data: {}
    };

    /**
     * setSuccess
     *   if param undefined success set TRUE;
     *
     * @param boolean
     * @returns {boolean}
     */
    this.setSuccess = function (boolean) {
        val.success = (typeof boolean === 'undefined') ? true : boolean;
        return true;
    };

    /**
     * getSuccess
     *
     * @returns {boolean}
     */
    this.getSuccess = function () {
        return val.success;
    };

    /**
     * setMsg
     *
     * @param msg
     * @param indexMessage
     * @returns {boolean}
     */
    this.setMsg = function (msg, indexMessage) {
        if (typeof msg === 'string') {
            val.msg.push(msg);

            return true;
        } else if (Array.isArray(msg)) {
            msg.forEach(function (error) {
                val.msg.push(error);
            });

            return true;
        } else if (typeof msg === "object") {
            for (var key in msg) {
                var pushMsg = (typeof indexMessage !== 'undefined') ? msg[key][indexMessage] : msg[key];
                val.msg.push(pushMsg);
            }

            return true;
        }
    };

    /**
     * getMsg
     *
     * @returns {Array}
     */
    this.getMsg = function () {
        return val.msg;
    };

    /**
     * hasMsg
     *
     * @returns {Number}
     */
    this.hasMsg = function () {
        return ((val.msg).length);
    };

    /**
     * setData
     *
     * @param data
     * @returns {boolean}
     */
    this.setData = function (data) {
        val.data = data;
        return true;
    };

    /**
     * insertData
     *
     * @param data
     * @returns {boolean}
     */
    this.insertData = function (data) {
        Object.assign(val.data, data);
        return true;
    };

    /**
     * getData
     *
     * @returns {{}|val.data}
     */
    this.getData = function () {
        return val.data;
    };

    /**
     * return
     *   if msg defined, set message before return
     *
     * @param msg
     * @returns {{success: boolean, msg: Array, data: {}}}
     */
    this.return = function (msg) {
        if (typeof msg !== 'undefined') {
            this.setMsg(msg);
        }

        return val;
    }
};

module.exports = Response;
