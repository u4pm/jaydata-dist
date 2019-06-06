'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.Notifications.ChangeCollectorBase', null, null, {
    buildData: function buildData(entityContextData) {
        _index.Guard.raise("Pure class");
    },
    processChangedData: function processChangedData(entityData) {
        if (this.Distrbutor && this.Distrbutor.distributeData) this.Distrbutor.distributeData(this.buildData(entityData));
    },
    Distrbutor: { enumerable: false, dataType: _index2.default.Notifications.ChangeDistributorBase, storeOnObject: true }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];