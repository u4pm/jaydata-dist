'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.FacebookConverter = {
    fromDb: {
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter,
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter,
        '$data.Number': _core2.default.Container.proxyConverter,
        '$data.Integer': _core2.default.Container.proxyConverter,
        '$data.String': _core2.default.Container.proxyConverter,
        '$data.Date': function $dataDate(value) {
            return new Date(typeof value === "string" ? parseInt(value) : value);
        },
        '$data.Boolean': function $dataBoolean(value) {
            return !!value;
        },
        '$data.Blob': _core2.default.Container.proxyConverter,
        '$data.Array': function $dataArray(value) {
            if (value === undefined) {
                return new _core2.default.Array();
            }return value;
        }
    },
    toDb: {
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter,
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter,
        '$data.Number': _core2.default.Container.proxyConverter,
        '$data.Integer': _core2.default.Container.proxyConverter,
        '$data.String': function $dataString(value) {
            return "'" + value + "'";
        },
        '$data.Date': function $dataDate(value) {
            return value ? value.valueOf() : null;
        },
        '$data.Boolean': _core2.default.Container.proxyConverter,
        '$data.Blob': _core2.default.Container.proxyConverter,
        '$data.Array': function $dataArray(value) {
            return '(' + value.join(', ') + ')';
        }
    }
};