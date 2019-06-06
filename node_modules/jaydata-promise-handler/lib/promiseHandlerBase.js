"use strict";
var extend = require("extend");
var jaydata_error_handler_1 = require("jaydata-error-handler");
var CallbackSettings = (function () {
    function CallbackSettings() {
    }
    return CallbackSettings;
}());
exports.CallbackSettings = CallbackSettings;
var PromiseNotImplemented = (function () {
    function PromiseNotImplemented() {
    }
    PromiseNotImplemented.prototype.always = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.always', 'Not implemented!')); };
    PromiseNotImplemented.prototype.done = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.done', 'Not implemented!')); };
    PromiseNotImplemented.prototype.fail = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.fail', 'Not implemented!')); };
    PromiseNotImplemented.prototype.isRejected = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.isRejected', 'Not implemented!')); };
    PromiseNotImplemented.prototype.isResolved = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.isResolved', 'Not implemented!')); };
    //notify() { Guard.raise(new Exception('$data.Promise.notify', 'Not implemented!')); }
    //notifyWith() { Guard.raise(new Exception('$data.Promise.notifyWith', 'Not implemented!')); }
    PromiseNotImplemented.prototype.pipe = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.pipe', 'Not implemented!')); };
    PromiseNotImplemented.prototype.progress = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.progress', 'Not implemented!')); };
    PromiseNotImplemented.prototype.promise = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.promise', 'Not implemented!')); };
    //reject() { Guard.raise(new Exception('$data.Promise.reject', 'Not implemented!')); }
    //rejectWith() { Guard.raise(new Exception('$data.Promise.rejectWith', 'Not implemented!')); }
    //resolve() { Guard.raise(new Exception('$data.Promise.resolve', 'Not implemented!')); }
    //resolveWith() { Guard.raise(new Exception('$data.Promise.resolveWith', 'Not implemented!')); }
    PromiseNotImplemented.prototype.state = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.state', 'Not implemented!')); };
    PromiseNotImplemented.prototype.then = function () { jaydata_error_handler_1.Guard.raise(new jaydata_error_handler_1.Exception('$data.Promise.then', 'Not implemented!')); };
    return PromiseNotImplemented;
}());
exports.PromiseNotImplemented = PromiseNotImplemented;
var PromiseHandlerBase = (function () {
    function PromiseHandlerBase() {
    }
    PromiseHandlerBase.defaultSuccessCallback = function () { };
    PromiseHandlerBase.defaultNotifyCallback = function () { };
    PromiseHandlerBase.defaultErrorCallback = function () {
        if (arguments.length > 0 && arguments[arguments.length - 1] && typeof arguments[arguments.length - 1].reject === 'function') {
            arguments[arguments.length - 1].reject.apply(arguments[arguments.length - 1], arguments);
        }
        else {
            if (arguments[0] instanceof Error) {
                console.error(arguments[0]);
            }
            else {
                console.error("DefaultError:", "DEFAULT ERROR CALLBACK!", arguments);
            }
        }
    };
    PromiseHandlerBase.createCallbackSettings = function (callback, defaultSettings) {
        var settings = defaultSettings || {
            success: PromiseHandlerBase.defaultSuccessCallback,
            error: PromiseHandlerBase.defaultErrorCallback,
            notify: PromiseHandlerBase.defaultNotifyCallback
        };
        var result = new CallbackSettings();
        if (callback == null || callback == undefined) {
            result = settings;
        }
        else if (typeof callback == 'function') {
            result = extend(settings, {
                success: callback
            });
        }
        else {
            result = extend(settings, callback);
        }
        var wrapCode = function (fn) {
            var t = this;
            function r() {
                fn.apply(t, arguments);
                fn = function () { };
            }
            return r;
        };
        if (typeof result.error === 'function')
            result.error = wrapCode(result.error);
        return result;
    };
    PromiseHandlerBase.prototype.createCallback = function (callback) {
        return PromiseHandlerBase.createCallbackSettings(callback);
    };
    PromiseHandlerBase.prototype.getPromise = function () {
        return new PromiseNotImplemented();
    };
    return PromiseHandlerBase;
}());
exports.PromiseHandlerBase = PromiseHandlerBase;
//# sourceMappingURL=promiseHandlerBase.js.map