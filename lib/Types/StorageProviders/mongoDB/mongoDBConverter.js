'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

var _atob = require('atob');

var _atob2 = _interopRequireDefault(_atob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.mongoDBConverter = {
    fromDb: {
        '$data.Enum': function $dataEnum(v, enumType) {
            return _core2.default.Container.convertTo(v, enumType);
        },
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter,
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter,
        '$data.Integer': _core2.default.Container.proxyConverter,
        '$data.Int32': _core2.default.Container.proxyConverter,
        '$data.Number': _core2.default.Container.proxyConverter,
        '$data.Duration': _core2.default.Container.proxyConverter,
        '$data.Day': _core2.default.Container.proxyConverter,
        '$data.Date': function $dataDate(date) {
            return date ? new Date(date) : date;
        },
        '$data.DateTimeOffset': function $dataDateTimeOffset(date) {
            return date ? new Date(date) : date;
        },
        '$data.Time': function $dataTime(date) {
            return date ? _core.Container.convertTo(date, _core2.default.Time) : date;
        },
        '$data.String': _core2.default.Container.proxyConverter,
        '$data.Boolean': _core2.default.Container.proxyConverter,
        '$data.Blob': function $dataBlob(v) {
            return v ? _core2.default.Container.convertTo(typeof v === 'string' ? (0, _atob2.default)(v) : v.buffer || v, _core2.default.Blob) : v;
        },
        '$data.Object': function $dataObject(o) {
            if (o === undefined) {
                return new _core2.default.Object();
            }return o;
        },
        '$data.Array': function $dataArray(o) {
            if (o === undefined) {
                return new _core2.default.Array();
            }return o;
        },
        '$data.ObjectID': function $dataObjectID(id) {
            return id ? new Buffer(id.toString(), 'ascii').toString('base64') : id;
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
        "$data.Guid": function $dataGuid(g) {
            return g ? _core2.default.parseGuid(g).toString() : g;
        }
    },
    toDb: {
        '$data.Enum': _core2.default.Container.proxyConverter,
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter,
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter,
        '$data.Integer': _core2.default.Container.proxyConverter,
        '$data.Int32': _core2.default.Container.proxyConverter,
        '$data.Number': _core2.default.Container.proxyConverter,
        '$data.Date': _core2.default.Container.proxyConverter,
        '$data.DateTimeOffset': _core2.default.Container.proxyConverter,
        '$data.Time': _core2.default.Container.proxyConverter,
        '$data.Duration': _core2.default.Container.proxyConverter,
        '$data.Day': _core2.default.Container.proxyConverter,
        '$data.String': _core2.default.Container.proxyConverter,
        '$data.Boolean': _core2.default.Container.proxyConverter,
        '$data.Blob': _core2.default.Container.proxyConverter,
        '$data.Object': _core2.default.Container.proxyConverter,
        '$data.Array': _core2.default.Container.proxyConverter,
        '$data.ObjectID': function $dataObjectID(id) {
            if (id && typeof id === 'string') {
                try {
                    return new _core2.default.ObjectID(id);
                } catch (e) {
                    try {
                        return new _core2.default.ObjectID(new Buffer(id, 'base64').toString('ascii'));
                    } catch (e) {
                        console.log(e);
                        return id;
                    }
                }
            } else return id;
        },
        '$data.GeographyPoint': function $dataGeographyPoint(g) {
            return g ? g.coordinates : g;
        },
        '$data.GeographyLineString': _core2.default.Container.proxyConverter,
        '$data.GeographyPolygon': _core2.default.Container.proxyConverter,
        '$data.GeographyMultiPoint': _core2.default.Container.proxyConverter,
        '$data.GeographyMultiLineString': _core2.default.Container.proxyConverter,
        '$data.GeographyMultiPolygon': _core2.default.Container.proxyConverter,
        '$data.GeographyCollection': _core2.default.Container.proxyConverter,
        '$data.GeometryPoint': function $dataGeometryPoint(g) {
            return g ? g.coordinates : g;
        },
        '$data.GeometryLineString': _core2.default.Container.proxyConverter,
        '$data.GeometryPolygon': _core2.default.Container.proxyConverter,
        '$data.GeometryMultiPoint': _core2.default.Container.proxyConverter,
        '$data.GeometryMultiLineString': _core2.default.Container.proxyConverter,
        '$data.GeometryMultiPolygon': _core2.default.Container.proxyConverter,
        '$data.GeometryCollection': _core2.default.Container.proxyConverter,
        "$data.Guid": function $dataGuid(g) {
            return g ? g.toString() : g;
        }
    }
};