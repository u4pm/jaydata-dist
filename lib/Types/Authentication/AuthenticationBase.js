"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../../TypeSystem/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define("$data.Authentication.AuthenticationBase", null, null, {
    constructor: function constructor(cfg) {
        this.configuration = cfg || {};
        this.Authenticated = false;
    },
    /// { error:, abort:, pending:, success: }
    Login: function Login(callbacks) {
        _index.Guard.raise("Pure class");
    },
    Logout: function Logout() {
        _index.Guard.raise("Pure class");
    },
    CreateRequest: function CreateRequest(cfg) {
        _index.Guard.raise("Pure class");
    }

}, null);

exports.default = _index2.default;
module.exports = exports['default'];