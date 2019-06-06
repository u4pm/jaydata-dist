'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.Promise', null, null, {
    always: function always() {
        _index.Guard.raise(new _index.Exception('$data.Promise.always', 'Not implemented!'));
    },
    done: function done() {
        _index.Guard.raise(new _index.Exception('$data.Promise.done', 'Not implemented!'));
    },
    fail: function fail() {
        _index.Guard.raise(new _index.Exception('$data.Promise.fail', 'Not implemented!'));
    },
    isRejected: function isRejected() {
        _index.Guard.raise(new _index.Exception('$data.Promise.isRejected', 'Not implemented!'));
    },
    isResolved: function isResolved() {
        _index.Guard.raise(new _index.Exception('$data.Promise.isResolved', 'Not implemented!'));
    },
    //notify: function () { Guard.raise(new Exception('$data.Promise.notify', 'Not implemented!')); },
    //notifyWith: function () { Guard.raise(new Exception('$data.Promise.notifyWith', 'Not implemented!')); },
    pipe: function pipe() {
        _index.Guard.raise(new _index.Exception('$data.Promise.pipe', 'Not implemented!'));
    },
    progress: function progress() {
        _index.Guard.raise(new _index.Exception('$data.Promise.progress', 'Not implemented!'));
    },
    promise: function promise() {
        _index.Guard.raise(new _index.Exception('$data.Promise.promise', 'Not implemented!'));
    },
    //reject: function () { Guard.raise(new Exception('$data.Promise.reject', 'Not implemented!')); },
    //rejectWith: function () { Guard.raise(new Exception('$data.Promise.rejectWith', 'Not implemented!')); },
    //resolve: function () { Guard.raise(new Exception('$data.Promise.resolve', 'Not implemented!')); },
    //resolveWith: function () { Guard.raise(new Exception('$data.Promise.resolveWith', 'Not implemented!')); },
    state: function state() {
        _index.Guard.raise(new _index.Exception('$data.Promise.state', 'Not implemented!'));
    },
    then: function then() {
        _index.Guard.raise(new _index.Exception('$data.Promise.then', 'Not implemented!'));
    }
}, null);

_index2.default.Class.define('$data.PromiseHandlerBase', null, null, {
    constructor: function constructor() {},
    createCallback: function createCallback(callBack) {
        callBack = _index2.default.PromiseHandlerBase.createCallbackSettings(callBack);

        return {
            success: callBack.success,
            error: callBack.error,
            notify: callBack.notify
        };
    },
    getPromise: function getPromise() {
        return new _index2.default.Promise();
    }
}, null);

_index2.default.PromiseHandler = _index2.default.PromiseHandlerBase;

exports.default = _index2.default;
module.exports = exports['default'];