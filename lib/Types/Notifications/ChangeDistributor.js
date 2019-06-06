'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.Notifications.ChangeDistributor', _index2.default.Notifications.ChangeDistributorBase, null, {
    constructor: function constructor(broadcastUrl) {
        this.broadcastUrl = broadcastUrl;
    },
    distributeData: function distributeData(data) {
        _index2.default.ajax({
            url: this.broadcastUrl,
            type: "POST",
            data: 'data=' + JSON.stringify(data),
            succes: this.success,
            error: this.error
        });
    },
    broadcastUrl: { dataType: "string" },
    success: function success() {},
    error: function error() {}
}, null);

exports.default = _index2.default;
module.exports = exports['default'];