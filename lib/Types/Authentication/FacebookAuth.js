'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define("$data.Authentication.FacebookAuth", _index2.default.Authentication.AuthenticationBase, null, {
    constructor: function constructor(cfg) {
        this.configuration = _index2.default.typeSystem.extend({
            Url_code: '',
            type_code: '',
            scope: '',
            Url_token: '',
            type_token: '',
            access_token: '',
            app_id: ''
        }, cfg);
    },
    Login: function Login(callbacks) {
        if (this.Authenticated) {
            return;
        }

        var provider = this;
        provider.configuration.stateCallbacks = callbacks || {};

        _index2.default.ajax({
            url: this.configuration.Url_code,
            data: 'type=' + provider.configuration.type_code + '&client_id=' + provider.configuration.app_id + '&scope=' + provider.configuration.scope,
            type: 'POST',
            dataType: 'json',
            success: function success(data) {
                if (typeof provider.configuration.stateCallbacks.pending == "function") provider.configuration.stateCallbacks.pending(data);
                provider._processRequestToken(data);
                provider.Authenticated = true;
            },
            error: function error() {
                if (typeof provider.configuration.stateCallbacks.error == "function") provider.configuration.stateCallbacks.error(arguments);
            }
        });
    },
    Logout: function Logout() {
        this.Authenticated = false;
    },
    CreateRequest: function CreateRequest(cfg) {
        if (!cfg) return;
        var _this = this;

        if (cfg.url.indexOf('access_token=') === -1) {
            if (cfg.url && this.Authenticated) {
                var andChar = '?';
                if (cfg.url.indexOf(andChar) > 0) andChar = '&';

                if (this.configuration.access_token) cfg.url = cfg.url + andChar + 'access_token=' + this.configuration.access_token;
            }
        }

        _index2.default.ajax(cfg);
    },
    _processRequestToken: function _processRequestToken(verification_data) {
        var provider = this;

        _index2.default.ajax({
            url: provider.configuration.Url_token,
            data: 'type=' + provider.configuration.type_token + '&client_id=' + provider.configuration.app_id + '&code=' + verification_data.code,
            type: 'POST',
            dataType: 'json',
            success: function success(result) {
                provider.configuration.access_token = result.access_token;
                if (typeof provider.configuration.stateCallbacks.success == "function") provider.configuration.stateCallbacks.success(result);
            },
            error: function error(obj) {
                var data = eval('(' + obj.responseText + ')');
                if (data.error) {
                    if (data.error.message == "authorization_pending") {
                        setTimeout(function () {
                            provider._processRequestToken(verification_data);
                        }, 2000);
                    } else if ("authorization_declined") {
                        if (typeof provider.configuration.stateCallbacks.abort == "function") provider.configuration.stateCallbacks.abort(arguments);
                    }
                }
            }
        });
    }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];