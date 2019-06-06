'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

var _atob = require('atob');

var _atob2 = _interopRequireDefault(_atob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.defaults = _core2.default.defaults || {};
_core2.default.defaults.oDataWebApi = false;

_core2.default.oDataConverter = {
    fromDb: {
        '$data.Enum': function $dataEnum(v, enumType) {
            return _core2.default.Container.convertTo(v, enumType);
        },
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': function $dataDecimal(v) {
            return _core2.default.Container.convertTo(v, _core2.default.Decimal);
        },
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': function $dataInt64(v) {
            return _core2.default.Container.convertTo(v, _core2.default.Int64);
        },
        '$data.ObjectID': _core2.default.Container.proxyConverter,
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
        '$data.Time': function $dataTime(v) {
            return _core2.default.Container.convertTo(v, _core2.default.Time);
        },
        '$data.Day': _core2.default.Container.proxyConverter,
        '$data.Duration': _core2.default.Container.proxyConverter,
        '$data.String': _core2.default.Container.proxyConverter,
        '$data.Boolean': _core2.default.Container.proxyConverter,
        '$data.Blob': function $dataBlob(v) {
            if (typeof v == 'string') {
                try {
                    return _core2.default.Container.convertTo((0, _atob2.default)(v), '$data.Blob');
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
        '$data.GeographyPoint': function $dataGeographyPoint(g) {
            if (g) {
                return new _core2.default.GeographyPoint(g);
            }return g;
        },
        '$data.GeographyLineString': function $dataGeographyLineString(g) {
            if (g) {
                return new _core2.default.GeographyLineString(g);
            }return g;
        },
        '$data.GeographyPolygon': function $dataGeographyPolygon(g) {
            if (g) {
                return new _core2.default.GeographyPolygon(g);
            }return g;
        },
        '$data.GeographyMultiPoint': function $dataGeographyMultiPoint(g) {
            if (g) {
                return new _core2.default.GeographyMultiPoint(g);
            }return g;
        },
        '$data.GeographyMultiLineString': function $dataGeographyMultiLineString(g) {
            if (g) {
                return new _core2.default.GeographyMultiLineString(g);
            }return g;
        },
        '$data.GeographyMultiPolygon': function $dataGeographyMultiPolygon(g) {
            if (g) {
                return new _core2.default.GeographyMultiPolygon(g);
            }return g;
        },
        '$data.GeographyCollection': function $dataGeographyCollection(g) {
            if (g) {
                return new _core2.default.GeographyCollection(g);
            }return g;
        },
        '$data.GeometryPoint': function $dataGeometryPoint(g) {
            if (g) {
                return new _core2.default.GeometryPoint(g);
            }return g;
        },
        '$data.GeometryLineString': function $dataGeometryLineString(g) {
            if (g) {
                return new _core2.default.GeometryLineString(g);
            }return g;
        },
        '$data.GeometryPolygon': function $dataGeometryPolygon(g) {
            if (g) {
                return new _core2.default.GeometryPolygon(g);
            }return g;
        },
        '$data.GeometryMultiPoint': function $dataGeometryMultiPoint(g) {
            if (g) {
                return new _core2.default.GeometryMultiPoint(g);
            }return g;
        },
        '$data.GeometryMultiLineString': function $dataGeometryMultiLineString(g) {
            if (g) {
                return new _core2.default.GeometryMultiLineString(g);
            }return g;
        },
        '$data.GeometryMultiPolygon': function $dataGeometryMultiPolygon(g) {
            if (g) {
                return new _core2.default.GeometryMultiPolygon(g);
            }return g;
        },
        '$data.GeometryCollection': function $dataGeometryCollection(g) {
            if (g) {
                return new _core2.default.GeometryCollection(g);
            }return g;
        },
        '$data.Guid': function $dataGuid(guid) {
            return guid ? guid.toString() : guid;
        }
    },
    toDb: {
        '$data.Enum': function $dataEnum(e, enumType) {
            return e !== null && e !== undefined ? enumType && enumType.getEnumName ? enumType.getEnumName(e) : "" : e;
        },
        '$data.Entity': _core2.default.Container.proxyConverter,
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter, //function (v) { return v ? parseFloat(v) : v },
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter, //function (v) { return v ? parseInt(v) : v },
        '$data.ObjectID': _core2.default.Container.proxyConverter,
        '$data.Integer': _core2.default.Container.proxyConverter,
        '$data.Int32': _core2.default.Container.proxyConverter,
        '$data.Number': _core2.default.Container.proxyConverter,
        '$data.Date': function $dataDate(e) {
            return e ? e.toISOString().replace('Z', '') : e;
        },
        '$data.Time': _core2.default.Container.proxyConverter,
        '$data.Day': _core2.default.Container.proxyConverter,
        '$data.Duration': _core2.default.Container.proxyConverter,
        '$data.DateTimeOffset': function $dataDateTimeOffset(v) {
            return v ? v.toISOString() : v;
        },
        '$data.String': _core2.default.Container.proxyConverter,
        '$data.Boolean': _core2.default.Container.proxyConverter,
        '$data.Blob': function $dataBlob(v) {
            return v ? _core2.default.Blob.toBase64(v) : v;
        },
        '$data.Object': _core2.default.Container.proxyConverter,
        '$data.Array': function $dataArray(o, def) {
            if (o && def && def.elementType) {
                var typeName = _core.Container.resolveName(def.elementType);
                var converter = _core2.default.oDataConverter['toDb'][typeName];
                var values = [];
                for (var i = 0; i < o.length; i++) {
                    values.push(converter ? converter(o[i]) : o[i]);
                }

                return values;
            }
            return _core2.default.Container.proxyConverter.apply(this, arguments);
        },
        '$data.GeographyPoint': _core2.default.Container.proxyConverter,
        '$data.GeographyLineString': _core2.default.Container.proxyConverter,
        '$data.GeographyPolygon': _core2.default.Container.proxyConverter,
        '$data.GeographyMultiPoint': _core2.default.Container.proxyConverter,
        '$data.GeographyMultiLineString': _core2.default.Container.proxyConverter,
        '$data.GeographyMultiPolygon': _core2.default.Container.proxyConverter,
        '$data.GeographyCollection': _core2.default.Container.proxyConverter,
        '$data.GeometryPoint': _core2.default.Container.proxyConverter,
        '$data.GeometryLineString': _core2.default.Container.proxyConverter,
        '$data.GeometryPolygon': _core2.default.Container.proxyConverter,
        '$data.GeometryMultiPoint': _core2.default.Container.proxyConverter,
        '$data.GeometryMultiLineString': _core2.default.Container.proxyConverter,
        '$data.GeometryMultiPolygon': _core2.default.Container.proxyConverter,
        '$data.GeometryCollection': _core2.default.Container.proxyConverter,
        '$data.Guid': _core2.default.Container.proxyConverter
    },
    escape: {
        '$data.Enum': function $dataEnum(e, enumType) {
            return e !== null && e !== undefined ? (enumType ? enumType.fullName : "") + "'" + e + "'" : e;
        },
        '$data.Entity': function $dataEntity(e) {
            return JSON.stringify(e);
        },
        '$data.Integer': _core2.default.Container.proxyConverter,
        '$data.Int32': _core2.default.Container.proxyConverter,
        '$data.Number': function $dataNumber(v) {
            return v && _core2.default.defaults.oDataWebApi ? v + 'd' : v;
        },
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': function $dataDecimal(v) {
            return v && _core2.default.defaults.oDataWebApi ? v + 'm' : v;
        },
        '$data.Float': function $dataFloat(v) {
            return v && _core2.default.defaults.oDataWebApi ? v + 'f' : v;
        },
        '$data.Int64': _core2.default.Container.proxyConverter,
        '$data.Time': _core2.default.Container.proxyConverter,
        '$data.Day': _core2.default.Container.proxyConverter,
        '$data.Duration': function $dataDuration(v) {
            return v ? "duration'" + v + "'" : v;
        },
        '$data.DateTimeOffset': function $dataDateTimeOffset(d) {
            return d ? encodeURIComponent(d) : d;
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
            return b ? "binary'" + b + "'" : b;
        },
        '$data.Object': function $dataObject(o) {
            return JSON.stringify(o);
        },
        '$data.Array': function $dataArray(o, def) {
            if (o && def && def.elementType) {
                var typeName = _core.Container.resolveName(def.elementType);
                var values = [];
                for (var i = 0; i < o.length; i++) {
                    values.push(_core2.default.oDataConverter['escape'][typeName](o[i]));
                }

                return "[" + values.join(',') + "]";
            }
            return JSON.stringify(o);
        },
        '$data.GeographyPoint': function $dataGeographyPoint(g) {
            if (g) {
                return _core2.default.GeographyBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeographyLineString': function $dataGeographyLineString(g) {
            if (g) {
                return _core2.default.GeographyBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeographyPolygon': function $dataGeographyPolygon(g) {
            if (g) {
                return _core2.default.GeographyBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeographyMultiPoint': function $dataGeographyMultiPoint(g) {
            if (g) {
                return _core2.default.GeographyBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeographyMultiLineString': function $dataGeographyMultiLineString(g) {
            if (g) {
                return _core2.default.GeographyBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeographyMultiPolygon': function $dataGeographyMultiPolygon(g) {
            if (g) {
                return _core2.default.GeographyBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeographyCollection': function $dataGeographyCollection(g) {
            if (g) {
                return _core2.default.GeographyBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeometryPoint': function $dataGeometryPoint(g) {
            if (g) {
                return _core2.default.GeometryBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeometryLineString': function $dataGeometryLineString(g) {
            if (g) {
                return _core2.default.GeometryBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeometryPolygon': function $dataGeometryPolygon(g) {
            if (g) {
                return _core2.default.GeometryBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeometryMultiPoint': function $dataGeometryMultiPoint(g) {
            if (g) {
                return _core2.default.GeometryBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeometryMultiLineString': function $dataGeometryMultiLineString(g) {
            if (g) {
                return _core2.default.GeometryBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeometryMultiPolygon': function $dataGeometryMultiPolygon(g) {
            if (g) {
                return _core2.default.GeometryBase.stringifyToUrl(g);
            }return g;
        },
        '$data.GeometryCollection': function $dataGeometryCollection(g) {
            if (g) {
                return _core2.default.GeometryBase.stringifyToUrl(g);
            }return g;
        },
        '$data.Guid': function $dataGuid(guid) {
            return guid ? "" + guid.toString() + "" : guid;
        }
    },
    unescape: {
        '$data.Entity': function $dataEntity(v, c) {
            var config = c || {};
            var value = JSON.parse(v);
            if (value && config.type) {
                var type = _core.Container.resolveType(config.type);
                /*Todo converter*/
                return new type(value, { converters: undefined });
            }
            return value;
        },
        '$data.Number': function $dataNumber(v) {
            return JSON.parse(v);
        },
        '$data.Integer': function $dataInteger(v) {
            return JSON.parse(v);
        },
        '$data.Int32': function $dataInt32(v) {
            return JSON.parse(v);
        },
        '$data.Byte': function $dataByte(v) {
            return JSON.parse(v);
        },
        '$data.SByte': function $dataSByte(v) {
            return JSON.parse(v);
        },
        '$data.Decimal': function $dataDecimal(v) {
            if (typeof v === 'string' && v.toLowerCase().lastIndexOf('m') === v.length - 1) {
                return v.substr(0, v.length - 1);
            } else {
                return v;
            }
        },
        '$data.Float': function $dataFloat(v) {
            if (typeof v === 'string' && v.toLowerCase().lastIndexOf('f') === v.length - 1) {
                return v.substr(0, v.length - 1);
            } else {
                return v;
            }
        },
        '$data.Int16': function $dataInt16(v) {
            return JSON.parse(v);
        },
        '$data.Int64': function $dataInt64(v) {
            return v;
        },
        '$data.Boolean': function $dataBoolean(v) {
            return JSON.parse(v);
        },
        '$data.Date': function $dataDate(v) {
            if (typeof v === 'string' && /^datetime'/.test(v)) {
                return v.slice(9, v.length - 1);
            }
            return v;
        },
        '$data.String': function $dataString(v) {
            if (typeof v === 'string' && v.indexOf("'") === 0 && v.lastIndexOf("'") === v.length - 1) {
                return v.slice(1, v.length - 1);
            } else {
                return v;
            }
        },
        '$data.ObjectID': function $dataObjectID(v) {
            if (typeof v === 'string' && v.indexOf("'") === 0 && v.lastIndexOf("'") === v.length - 1) {
                return v.slice(1, v.length - 1);
            } else {
                return v;
            }
        },
        '$data.Guid': function $dataGuid(v) {
            if (/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(v)) {
                var data = v.slice(5, v.length - 1);
                return _core2.default.parseGuid(data).toString();
            }
            return v;
        },
        '$data.Array': function $dataArray(v, c) {
            var config = c || {};

            var value = JSON.parse(v) || [];
            if (value && config.elementType) {
                var type = _core.Container.resolveType(config.elementType);
                var typeName = _core.Container.resolveName(type);
                if (type && type.isAssignableTo && type.isAssignableTo(_core2.default.Entity)) {
                    typeName = _core2.default.Entity.fullName;
                }

                if (Array.isArray(value)) {
                    var converter = _core2.default.oDataConverter.unescape[typeName];
                    for (var i = 0; i < value.length; i++) {
                        value[i] = converter ? converter(value[i]) : value[i];
                    }
                }
                return value;
            }
            return value;
        },
        '$data.DateTimeOffset': function $dataDateTimeOffset(v) {
            if (typeof v === 'string') {
                return _core2.default.Container.convertTo(v, _core2.default.DateTimeOffset);
            }
            return v;
        },
        '$data.Time': function $dataTime(v) {
            if (typeof v === 'string' && /^time'/.test(v)) {
                return _core2.default.Container.convertTo(v.slice(5, v.length - 1), _core2.default.Time);
            }
            return v;
        },
        '$data.Day': function $dataDay(v) {
            if (typeof v === 'string' && /^date'/.test(v)) {
                return _core2.default.Container.convertTo(v.slice(5, v.length - 1), _core2.default.Day);
            }
            return v;
        },
        '$data.Duration': function $dataDuration(v) {
            if (typeof v === 'string' && /^duration'/.test(v)) {
                return _core2.default.Container.convertTo(v.slice(9, v.length - 1), _core2.default.Duration);
            }
            return v;
        },
        '$data.Blob': function $dataBlob(v) {
            if (typeof v === 'string') {
                if (/^X'/.test(v)) {
                    return _core2.default.Blob.createFromHexString(v.slice(2, v.length - 1));
                } else if (/^binary'/.test(v)) {
                    return _core2.default.Blob.createFromHexString(v.slice(7, v.length - 1));
                }
            }
            return v;
        },
        '$data.Object': function $dataObject(v) {
            return JSON.parse(v);
        },
        '$data.GeographyPoint': function $dataGeographyPoint(v) {
            if (/^geography'POINT\(/i.test(v)) {
                var data = v.slice(10, v.length - 1);
                return _core2.default.GeographyBase.parseFromString(data);
            }
            return v;
        },
        '$data.GeographyPolygon': function $dataGeographyPolygon(v) {
            if (/^geography'POLYGON\(/i.test(v)) {
                var data = v.slice(10, v.length - 1);
                return _core2.default.GeographyBase.parseFromString(data);
            }
            return v;
        },
        '$data.GeometryPoint': function $dataGeometryPoint(v) {
            if (/^geometry'POINT\(/i.test(v)) {
                var data = v.slice(9, v.length - 1);
                return _core2.default.GeometryBase.parseFromString(data);
            }
            return v;
        },
        '$data.GeometryPolygon': function $dataGeometryPolygon(v) {
            if (/^geometry'POLYGON\(/i.test(v)) {
                var data = v.slice(9, v.length - 1);
                return _core2.default.GeometryBase.parseFromString(data);
            }
            return v;
        }
    },
    xmlEscape: {
        '$data.Byte': function $dataByte(v) {
            return v.toString();
        },
        '$data.SByte': function $dataSByte(v) {
            return v.toString();
        },
        '$data.Decimal': function $dataDecimal(v) {
            return v.toString();
        },
        '$data.Float': function $dataFloat(v) {
            return v.toString();
        },
        '$data.Int16': function $dataInt16(v) {
            return v.toString();
        },
        '$data.Int64': function $dataInt64(v) {
            return v.toString();
        },
        '$data.Integer': function $dataInteger(v) {
            return v.toString();
        },
        '$data.Int32': function $dataInt32(v) {
            return v.toString();
        },
        '$data.Boolean': function $dataBoolean(v) {
            return v.toString();
        },
        '$data.Blob': function $dataBlob(v) {
            return _core2.default.Blob.toBase64(v);
        },
        '$data.Date': function $dataDate(v) {
            return v.toISOString().replace('Z', '');
        },
        '$data.DateTimeOffset': function $dataDateTimeOffset(v) {
            return v.toISOString();
        },
        '$data.Time': function $dataTime(v) {
            return v.toString();
        },
        '$data.Day': function $dataDay(v) {
            return v.toString();
        },
        '$data.Duration': function $dataDuration(v) {
            return v.toString();
        },
        '$data.Number': function $dataNumber(v) {
            return v.toString();
        },
        '$data.String': function $dataString(v) {
            return v.toString();
        },
        '$data.ObjectID': function $dataObjectID(v) {
            return v.toString();
        },
        '$data.Object': function $dataObject(v) {
            return JSON.stringify(v);
        },
        '$data.Guid': function $dataGuid(v) {
            return v.toString();
        } /*,
          '$data.GeographyPoint': function (v) { return this._buildSpatialPoint(v, 'http://www.opengis.net/def/crs/EPSG/0/4326'); },
          '$data.GeometryPoint': function (v) { return this._buildSpatialPoint(v, 'http://www.opengis.net/def/crs/EPSG/0/0'); },
          '$data.GeographyLineString': function (v) { return this._buildSpatialLineString(v, 'http://www.opengis.net/def/crs/EPSG/0/4326'); },
          '$data.GeometryLineString': function (v) { return this._buildSpatialLineString(v, 'http://www.opengis.net/def/crs/EPSG/0/0'); }*/
    },
    simple: { //$value, $count
        '$data.Byte': function $dataByte(v) {
            return v.toString();
        },
        '$data.SByte': function $dataSByte(v) {
            return v.toString();
        },
        '$data.Decimal': function $dataDecimal(v) {
            return v.toString();
        },
        '$data.Float': function $dataFloat(v) {
            return v.toString();
        },
        '$data.Int16': function $dataInt16(v) {
            return v.toString();
        },
        '$data.Int64': function $dataInt64(v) {
            return v.toString();
        },
        '$data.ObjectID': function $dataObjectID(o) {
            return o.toString();
        },
        '$data.Integer': function $dataInteger(o) {
            return o.toString();
        },
        '$data.Int32': function $dataInt32(o) {
            return o.toString();
        },
        '$data.Number': function $dataNumber(o) {
            return o.toString();
        },
        '$data.Date': function $dataDate(o) {
            return o instanceof _core2.default.Date ? o.toISOString().replace('Z', '') : o.toString();
        },
        '$data.DateTimeOffset': function $dataDateTimeOffset(v) {
            return v ? v.toISOString() : v;
        },
        '$data.Time': function $dataTime(o) {
            return o.toString();
        },
        '$data.Day': function $dataDay(o) {
            return o.toString();
        },
        '$data.Duration': function $dataDuration(o) {
            return o.toString();
        },
        '$data.String': function $dataString(o) {
            return o.toString();
        },
        '$data.Boolean': function $dataBoolean(o) {
            return o.toString();
        },
        '$data.Blob': function $dataBlob(o) {
            return o;
        },
        '$data.Object': function $dataObject(o) {
            return JSON.stringify(o);
        },
        '$data.Array': function $dataArray(o) {
            return JSON.stringify(o);
        },
        '$data.Guid': function $dataGuid(o) {
            return o.toString();
        },
        '$data.GeographyPoint': function $dataGeographyPoint(o) {
            return JSON.stringify(o);
        },
        '$data.GeometryPoint': function $dataGeometryPoint(o) {
            return JSON.stringify(o);
        },
        '$data.GeographyLineString': function $dataGeographyLineString(o) {
            return JSON.stringify(o);
        },
        '$data.GeographyPolygon': function $dataGeographyPolygon(o) {
            return JSON.stringify(o);
        },
        '$data.GeographyMultiPoint': function $dataGeographyMultiPoint(o) {
            return JSON.stringify(o);
        },
        '$data.GeographyMultiLineString': function $dataGeographyMultiLineString(o) {
            return JSON.stringify(o);
        },
        '$data.GeographyMultiPolygon': function $dataGeographyMultiPolygon(o) {
            return JSON.stringify(o);
        },
        '$data.GeographyCollection': function $dataGeographyCollection(o) {
            return JSON.stringify(o);
        },
        '$data.GeometryLineString': function $dataGeometryLineString(o) {
            return JSON.stringify(o);
        },
        '$data.GeometryPolygon': function $dataGeometryPolygon(o) {
            return JSON.stringify(o);
        },
        '$data.GeometryMultiPoint': function $dataGeometryMultiPoint(o) {
            return JSON.stringify(o);
        },
        '$data.GeometryMultiLineString': function $dataGeometryMultiLineString(o) {
            return JSON.stringify(o);
        },
        '$data.GeometryMultiPolygon': function $dataGeometryMultiPolygon(o) {
            return JSON.stringify(o);
        },
        '$data.GeometryCollection': function $dataGeometryCollection(o) {
            return JSON.stringify(o);
        }
    }
};