"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var extend = require("extend");
var promiseHandlerBase_1 = require("./promiseHandlerBase");
var PromiseHandler = (function (_super) {
    __extends(PromiseHandler, _super);
    function PromiseHandler() {
        var _this = _super.call(this) || this;
        var self = _this;
        var promise = new Promise(function (resolve, reject) {
            self.resolve = resolve;
            self.reject = reject;
        });
        _this.deferred = {
            resolve: function () { self.resolve.apply(promise, arguments); },
            reject: function () { self.reject.apply(promise, arguments); },
            promise: promise
        };
        return _this;
    }
    PromiseHandler.prototype.createCallback = function (callback) {
        var settings = promiseHandlerBase_1.PromiseHandlerBase.createCallbackSettings(callback);
        var self = this;
        var result = new promiseHandlerBase_1.CallbackSettings();
        result = extend(result, {
            success: function () {
                settings.success.apply(self.deferred, arguments);
                self.resolve.apply(self.deferred, arguments);
            },
            error: function () {
                Array.prototype.push.call(arguments, self.deferred);
                settings.error.apply(self.deferred, arguments);
            },
            notify: function () {
                settings.notify.apply(self.deferred, arguments);
            }
        });
        return result;
    };
    PromiseHandler.prototype.getPromise = function () {
        return this.deferred.promise;
    };
    PromiseHandler.compatibilityMode = function () {
        Promise.prototype['fail'] = function (onReject) {
            return this.then(null, function (reason) {
                onReject(reason);
                throw reason;
            });
        };
        Promise.prototype['always'] = function (onResolveOrReject) {
            return this.then(onResolveOrReject, function (reason) {
                onResolveOrReject(reason);
                throw reason;
            });
        };
    };
    PromiseHandler.use = function ($data) {
        $data.PromiseHandler = typeof Promise == 'function' ? PromiseHandler : promiseHandlerBase_1.PromiseHandlerBase;
        $data.PromiseHandlerBase = promiseHandlerBase_1.PromiseHandlerBase;
        $data.Promise = promiseHandlerBase_1.PromiseNotImplemented;
    };
    return PromiseHandler;
}(promiseHandlerBase_1.PromiseHandlerBase));
exports.PromiseHandler = PromiseHandler;
//# sourceMappingURL=promise.js.map