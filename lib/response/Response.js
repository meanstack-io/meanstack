/**
 * Response
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2017, MEANStack.io.
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
     * @type {{success: boolean, msg: Array, payload: {}}}
     */
    var val = {
        success: false,
        msg: [],
        payload: {}
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
     * Get Success
     *
     * @returns {boolean}
     */
    this.success = function () {
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
     * dispatch
     *
     * @param payload
     * @returns {boolean}
     */
    this.dispatch = function (payload) {
        val.payload = payload;
        return true;
    };

    /**
     * assignDispatch
     *
     * @param payload
     * @returns {boolean}
     */
    this.assignDispatch = function (payload) {
        Object.assign(val.payload, payload);
        return true;
    };

    /**
     * payload
     *
     * @returns {{}|val.payload}
     */
    this.payload = function () {
        return val.payload;
    };

    /**
     * return
     *   if msg defined, set message before return
     *
     * @param msg
     * @returns {{success: boolean, msg: Array, payload: {}}}
     */
    this.return = function (msg) {
        if (typeof msg !== 'undefined') {
            this.setMsg(msg);
        }

        return val;
    }
};

module.exports = Response;
