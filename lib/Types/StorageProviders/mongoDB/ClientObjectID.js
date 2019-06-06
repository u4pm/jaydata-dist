'use strict';

var _btoa = require('btoa');

var _btoa2 = _interopRequireDefault(_btoa);

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.storageProviders.mongoDB.mongoDBProvider.ClientObjectID', null, null, {
    constructor: function constructor() {
        var time = Math.floor(new Date().getTime() / 1000).toString(16);

        var b64ua = (0, _btoa2.default)(navigator ? navigator.userAgent : 'nodejs');
        var machine = (b64ua.charCodeAt(0) + b64ua.charCodeAt(1)).toString(16) + (b64ua.charCodeAt(2) + b64ua.charCodeAt(3)).toString(16) + (b64ua.charCodeAt(4) + b64ua.charCodeAt(5)).toString(16);

        var pid = ('0000' + Math.floor(Math.random() * 0xffff).toString(16)).slice(-4);
        var inc = ('000000' + (++_core2.default.storageProviders.mongoDB.mongoDBProvider.ClientObjectID.idSeed).toString(16)).slice(-6);

        this.toString = this.toLocaleString = this.valueOf = function () {
            return (0, _btoa2.default)(time + machine + pid + inc);
        };
    },
    value: { value: null }
}, {
    idSeed: { value: Math.floor(Math.random() * 0xff) }
});