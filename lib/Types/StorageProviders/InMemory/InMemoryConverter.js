'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.InMemoryConverter = {
    fromDb: {
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
        '$data.String': _core2.default.Container.proxyConverter,
        '$data.Boolean': _core2.default.Container.proxyConverter,
        '$data.Blob': _core2.default.Container.proxyConverter,
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
        '$data.Guid': function $dataGuid(guid) {
            return guid ? _core2.default.parseGuid(guid).toString() : guid;
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
        }
    },
    toDb: {
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
        '$data.String': _core2.default.Container.proxyConverter,
        '$data.Boolean': _core2.default.Container.proxyConverter,
        '$data.Blob': _core2.default.Container.proxyConverter,
        '$data.Object': _core2.default.Container.proxyConverter,
        '$data.Array': _core2.default.Container.proxyConverter,
        '$data.Guid': function $dataGuid(guid) {
            return guid ? guid.toString() : guid;
        },
        '$data.GeographyPoint': function $dataGeographyPoint(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeographyLineString': function $dataGeographyLineString(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeographyPolygon': function $dataGeographyPolygon(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeographyMultiPoint': function $dataGeographyMultiPoint(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeographyMultiLineString': function $dataGeographyMultiLineString(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeographyMultiPolygon': function $dataGeographyMultiPolygon(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeographyCollection': function $dataGeographyCollection(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeometryPoint': function $dataGeometryPoint(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeometryLineString': function $dataGeometryLineString(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeometryPolygon': function $dataGeometryPolygon(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeometryMultiPoint': function $dataGeometryMultiPoint(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeometryMultiLineString': function $dataGeometryMultiLineString(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeometryMultiPolygon': function $dataGeometryMultiPolygon(g) {
            if (g) {
                return g;
            }return g;
        },
        '$data.GeometryCollection': function $dataGeometryCollection(g) {
            if (g) {
                return g;
            }return g;
        }
    },
    escape: {
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter,
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter,
        '$data.Integer': _core2.default.Container.proxyConverter,
        '$data.Int32': _core2.default.Container.proxyConverter,
        '$data.Number': _core2.default.Container.proxyConverter,
        '$data.Date': function $dataDate(date) {
            return date ? "new Date(Date.parse('" + date.toISOString() + "'))" : date;
        },
        '$data.DateTimeOffset': function $dataDateTimeOffset(date) {
            return date ? "new Date(Date.parse('" + date.toISOString() + "'))" : date;
        },
        '$data.Time': function $dataTime(date) {
            return date ? "'" + date + "'" : date;
        },
        '$data.String': function $dataString(text) {
            return "'" + text.replace(/'/g, "''") + "'";
        },
        '$data.Boolean': function $dataBoolean(bool) {
            return bool ? 'true' : 'false';
        },
        '$data.Blob': function $dataBlob(blob) {
            return "'" + _core2.default.Blob.toString(blob) + "'";
        },
        '$data.Object': function $dataObject(o) {
            return JSON.stringify(o);
        },
        '$data.Array': function $dataArray(o) {
            return JSON.stringify(o);
        },
        '$data.Guid': function $dataGuid(guid) {
            return guid ? "'" + guid.toString() + "'" : guid;
        }
    }
};