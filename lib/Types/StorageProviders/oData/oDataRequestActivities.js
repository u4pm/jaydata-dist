'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestBuilder = exports.RequestBuilder = function () {
    function RequestBuilder(context, request) {
        _classCallCheck(this, RequestBuilder);

        this._context = context;
        this._request = request || {};
        this._activities = [];
    }

    _createClass(RequestBuilder, [{
        key: 'get',
        value: function get() {
            return this._request;
        }
    }, {
        key: 'add',
        value: function add() {
            var _activities;

            (_activities = this._activities).push.apply(_activities, arguments);
            return this;
        }
    }, {
        key: 'build',
        value: function build() {
            var _this = this;

            this._request.headers = this._request.headers || {};
            this._request.data = this._request.data || {};

            this._activities.forEach(function (a) {
                return a instanceof RequestActivity ? a.implementation(_this._request, _this._context) : a(_this._request, _this._context);
            });

            this._activities = [];
            return this;
        }
    }]);

    return RequestBuilder;
}();

var RequestActivity = exports.RequestActivity = function () {
    function RequestActivity() {
        _classCallCheck(this, RequestActivity);
    }

    _createClass(RequestActivity, [{
        key: 'implementation',
        value: function implementation(request, provider) {}
    }]);

    return RequestActivity;
}();

var SetRequestActivity = exports.SetRequestActivity = function (_RequestActivity) {
    _inherits(SetRequestActivity, _RequestActivity);

    function SetRequestActivity(key, value) {
        _classCallCheck(this, SetRequestActivity);

        var _this2 = _possibleConstructorReturn(this, (SetRequestActivity.__proto__ || Object.getPrototypeOf(SetRequestActivity)).call(this));

        _this2.key = key;
        _this2.value = value;
        return _this2;
    }

    _createClass(SetRequestActivity, [{
        key: 'implementation',
        value: function implementation(request, provider) {}
    }]);

    return SetRequestActivity;
}(RequestActivity);

var SetRequestProperty = exports.SetRequestProperty = function (_SetRequestActivity) {
    _inherits(SetRequestProperty, _SetRequestActivity);

    function SetRequestProperty() {
        _classCallCheck(this, SetRequestProperty);

        return _possibleConstructorReturn(this, (SetRequestProperty.__proto__ || Object.getPrototypeOf(SetRequestProperty)).apply(this, arguments));
    }

    _createClass(SetRequestProperty, [{
        key: 'implementation',
        value: function implementation(request, provider) {
            request[this.key] = this.value;
        }
    }]);

    return SetRequestProperty;
}(SetRequestActivity);

var SetDataProperty = exports.SetDataProperty = function (_SetRequestActivity2) {
    _inherits(SetDataProperty, _SetRequestActivity2);

    function SetDataProperty() {
        _classCallCheck(this, SetDataProperty);

        return _possibleConstructorReturn(this, (SetDataProperty.__proto__ || Object.getPrototypeOf(SetDataProperty)).apply(this, arguments));
    }

    _createClass(SetDataProperty, [{
        key: 'implementation',
        value: function implementation(request, provider) {
            request.data[this.key] = this.value;
        }
    }]);

    return SetDataProperty;
}(SetRequestActivity);

var SetHeaderProperty = exports.SetHeaderProperty = function (_SetRequestActivity3) {
    _inherits(SetHeaderProperty, _SetRequestActivity3);

    function SetHeaderProperty() {
        _classCallCheck(this, SetHeaderProperty);

        return _possibleConstructorReturn(this, (SetHeaderProperty.__proto__ || Object.getPrototypeOf(SetHeaderProperty)).apply(this, arguments));
    }

    _createClass(SetHeaderProperty, [{
        key: 'implementation',
        value: function implementation(request, provider) {
            request.headers[this.key] = this.value;
        }
    }]);

    return SetHeaderProperty;
}(SetRequestActivity);

var SetUrl = exports.SetUrl = function (_SetRequestProperty) {
    _inherits(SetUrl, _SetRequestProperty);

    function SetUrl(url) {
        _classCallCheck(this, SetUrl);

        return _possibleConstructorReturn(this, (SetUrl.__proto__ || Object.getPrototypeOf(SetUrl)).call(this, 'requestUri', url));
    }

    return SetUrl;
}(SetRequestProperty);

var AppendUrl = exports.AppendUrl = function (_SetUrl) {
    _inherits(AppendUrl, _SetUrl);

    function AppendUrl() {
        _classCallCheck(this, AppendUrl);

        return _possibleConstructorReturn(this, (AppendUrl.__proto__ || Object.getPrototypeOf(AppendUrl)).apply(this, arguments));
    }

    _createClass(AppendUrl, [{
        key: 'implementation',
        value: function implementation(request, provider) {
            request[this.key] == request[this.key] || "";
            request[this.key] += this.value;
        }
    }]);

    return AppendUrl;
}(SetUrl);

var SetMethod = exports.SetMethod = function (_SetRequestProperty2) {
    _inherits(SetMethod, _SetRequestProperty2);

    function SetMethod(method) {
        _classCallCheck(this, SetMethod);

        return _possibleConstructorReturn(this, (SetMethod.__proto__ || Object.getPrototypeOf(SetMethod)).call(this, 'method', method));
    }

    return SetMethod;
}(SetRequestProperty);

var SetProperty = exports.SetProperty = function (_SetDataProperty) {
    _inherits(SetProperty, _SetDataProperty);

    function SetProperty() {
        _classCallCheck(this, SetProperty);

        return _possibleConstructorReturn(this, (SetProperty.__proto__ || Object.getPrototypeOf(SetProperty)).apply(this, arguments));
    }

    return SetProperty;
}(SetDataProperty);

var SetNavigationProperty = exports.SetNavigationProperty = function (_SetDataProperty2) {
    _inherits(SetNavigationProperty, _SetDataProperty2);

    function SetNavigationProperty() {
        _classCallCheck(this, SetNavigationProperty);

        return _possibleConstructorReturn(this, (SetNavigationProperty.__proto__ || Object.getPrototypeOf(SetNavigationProperty)).apply(this, arguments));
    }

    _createClass(SetNavigationProperty, [{
        key: 'implementation',
        value: function implementation(request, provider) {
            request.data[this.key] = this.value;
        }
    }]);

    return SetNavigationProperty;
}(SetDataProperty);

var ClearRequestData = exports.ClearRequestData = function (_RequestActivity2) {
    _inherits(ClearRequestData, _RequestActivity2);

    function ClearRequestData() {
        _classCallCheck(this, ClearRequestData);

        return _possibleConstructorReturn(this, (ClearRequestData.__proto__ || Object.getPrototypeOf(ClearRequestData)).apply(this, arguments));
    }

    _createClass(ClearRequestData, [{
        key: 'implementation',
        value: function implementation(request, provider) {
            delete request.data;
        }
    }]);

    return ClearRequestData;
}(RequestActivity);