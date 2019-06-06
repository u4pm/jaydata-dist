'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define("$data.EntityAttachMode", null, null, {}, {
    defaultMode: 'Default',
    AllChanged: function AllChanged(data) {
        var memDefs = data.getType().memberDefinitions.getPublicMappedProperties();
        for (var i = 0; i < memDefs.length; i++) {
            data._setPropertyChanged(memDefs[i]);
        }
        data.entityState = _index2.default.EntityState.Modified;
    },
    KeepChanges: function KeepChanges(data) {
        if (data.changedProperties && data.changedProperties.length > 0) {
            data.entityState = _index2.default.EntityState.Modified;
        } else {
            data.entityState = _index2.default.EntityState.Unchanged;
        }
    },
    Default: function Default(data) {
        data.entityState = _index2.default.EntityState.Unchanged;
        data.changedProperties = undefined;
    }
});

exports.default = _index2.default;
module.exports = exports['default'];