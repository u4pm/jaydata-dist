'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.WebApiConverter = {
    fromDb: {
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter,
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter,

        '$data.Integer': _core2.default.Container.proxyConverter, //function (number) { return (typeof number === 'string' && /^\d+$/.test(number)) ? parseInt(number) : number; },
        '$data.Int32': _core2.default.Container.proxyConverter,
        '$data.Number': _core2.default.Container.proxyConverter,
        '$data.Date': function $dataDate(dbData) {
            if (dbData) {
                if (dbData instanceof Date) {
                    return dbData;
                } else if (dbData.substring(0, 6) === '/Date(') {
                    return new Date(parseInt(dbData.substr(6)));
                } else {
                    //ISODate without Z? Safari compatible with Z
                    if (dbData.indexOf('Z') === -1 && !dbData.match('T.*[+-]')) dbData += 'Z';
                    return new Date(dbData);
                }
            } else {
                return dbData;
            }
        },
        '$data.DateTimeOffset': function $dataDateTimeOffset(dbData) {
            if (dbData) {
                if (dbData instanceof Date) {
                    return dbData;
                } else if (dbData.substring(0, 6) === '/Date(') {
                    return new Date(parseInt(dbData.substr(6)));
                } else {
                    //ISODate without Z? Safari compatible with Z
                    if (dbData.indexOf('Z') === -1 && !dbData.match('T.*[+-]')) dbData += 'Z';
                    return new Date(dbData);
                }
            } else {
                return dbData;
            }
        },
        '$data.Time': _core2.default.Container.proxyConverter,
        '$data.String': _core2.default.Container.proxyConverter,
        '$data.Boolean': _core2.default.Container.proxyConverter,
        '$data.Blob': function $dataBlob(v) {
            if (typeof v == 'string') {
                try {
                    return _core2.default.Container.convertTo(atob(v), '$data.Blob');
                } catch (e) {
                    return v;
                }
            } else return v;
        },
        '$data.Object': function $dataObject(o) {
            if (o === undefined) {
                return new _core2.default.Object();
            } else if (typeof o === 'string') {
                return JSON.parse(o);
            }return o;
        },
        '$data.Array': function $dataArray(o) {
            if (o === undefined) {
                return new _core2.default.Array();
            } else if (o instanceof _core2.default.Array) {
                return o;
            }return JSON.parse(o);
        },
        '$data.GeographyPoint': function $dataGeographyPoint(geo) {
            if (geo && (typeof geo === 'undefined' ? 'undefined' : _typeof(geo)) === 'object' && Array.isArray(geo.coordinates)) {
                return new _core2.default.GeographyPoint(geo.coordinates);
            }
            return geo;
        },
        '$data.Guid': function $dataGuid(guid) {
            return guid ? guid.toString() : guid;
        }
    },
    toDb: {
        '$data.Entity': _core2.default.Container.proxyConverter,
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter,
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter,
        '$data.ObjectID': _core2.default.Container.proxyConverter,
        '$data.Integer': _core2.default.Container.proxyConverter,
        '$data.Int32': _core2.default.Container.proxyConverter,
        '$data.Number': _core2.default.Container.proxyConverter,
        '$data.Date': function $dataDate(e) {
            return e ? e.toISOString().replace('Z', '') : e;
        },
        '$data.Time': _core2.default.Container.proxyConverter,
        '$data.DateTimeOffset': function $dataDateTimeOffset(v) {
            return v ? v.toISOString() : v;
        },
        '$data.String': _core2.default.Container.proxyConverter,
        '$data.Boolean': _core2.default.Container.proxyConverter,
        '$data.Blob': function $dataBlob(v) {
            return v ? _core2.default.Blob.toBase64(v) : v;
        },
        '$data.Object': _core2.default.Container.proxyConverter,
        '$data.Array': _core2.default.Container.proxyConverter,
        '$data.GeographyPoint': _core2.default.Container.proxyConverter,
        '$data.Guid': _core2.default.Container.proxyConverter
    },
    escape: {
        '$data.Entity': function $dataEntity(e) {
            return JSON.stringify(e);
        },
        '$data.Integer': _core2.default.Container.proxyConverter,
        '$data.Int32': _core2.default.Container.proxyConverter,
        '$data.Number': _core2.default.Container.proxyConverter, // double: 13.5D
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': function $dataDecimal(v) {
            return v ? v + 'm' : v;
        },
        '$data.Float': function $dataFloat(v) {
            return v ? v + 'f' : v;
        },
        '$data.Int64': function $dataInt64(v) {
            return v ? v + 'L' : v;
        },
        '$data.Time': function $dataTime(v) {
            return v ? "time'" + v + "'" : v;
        },
        '$data.DateTimeOffset': function $dataDateTimeOffset(date) {
            return date ? "datetimeoffset'" + date + "'" : date;
        },
        '$data.Date': function $dataDate(date) {
            return date ? "datetime'" + date + "'" : date;
        },
        '$data.String': function $dataString(text) {
            return typeof text === 'string' ? "'" + text.replace(/'/g, "''") + "'" : text;
        },
        '$data.ObjectID': function $dataObjectID(text) {
            return typeof text === 'string' ? "'" + text.replace(/'/g, "''") + "'" : text;
        },
        '$data.Boolean': function $dataBoolean(bool) {
            return typeof bool === 'boolean' ? bool.toString() : bool;
        },
        '$data.Blob': function $dataBlob(b) {
            return b ? "X'" + _core2.default.Blob.toHexString(_core2.default.Container.convertTo(atob(b), _core2.default.Blob)) + "'" : b;
        },
        '$data.Object': function $dataObject(o) {
            return JSON.stringify(o);
        },
        '$data.Array': function $dataArray(o) {
            return JSON.stringify(o);
        },
        '$data.GeographyPoint': function $dataGeographyPoint(g) {
            if (g) {
                return _core2.default.GeographyBase.stringifyToUrl(g);
            }return g;
        },
        '$data.Guid': function $dataGuid(guid) {
            return guid ? "guid'" + guid.toString() + "'" : guid;
        }
    }
};