'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../../core.js');

var _core2 = _interopRequireDefault(_core);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Deferred = function (_$data$PromiseHandler) {
    _inherits(Deferred, _$data$PromiseHandler);

    function Deferred() {
        _classCallCheck(this, Deferred);

        var _this = _possibleConstructorReturn(this, (Deferred.__proto__ || Object.getPrototypeOf(Deferred)).call(this));

        _this.deferred = new _jquery2.default.Deferred();
        return _this;
    }

    _createClass(Deferred, [{
        key: 'createCallback',
        value: function createCallback(callBack) {
            callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);
            var self = this;

            return {
                success: function success() {
                    callBack.success.apply(self.deferred, arguments);
                    self.deferred.resolve.apply(self.deferred, arguments);
                },
                error: function error() {
                    Array.prototype.push.call(arguments, self.deferred);
                    callBack.error.apply(self.deferred, arguments);
                },
                notify: function notify() {
                    callBack.notify.apply(self.deferred, arguments);
                    self.deferred.notify.apply(self.deferred, arguments);
                }
            };
        }
    }, {
        key: 'getPromise',
        value: function getPromise() {
            return this.deferred.promise();
        }
    }]);

    return Deferred;
}(_core2.default.PromiseHandlerBase);

_core2.default.PromiseHandler = _core2.default.Deferred = Deferred;
exports.default = _core2.default;
module.exports = exports['default'];