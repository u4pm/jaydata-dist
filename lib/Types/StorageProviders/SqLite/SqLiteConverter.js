'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.SqLiteConverter = {
    fromDb: {
        '$data.Enum': function $dataEnum(v, enumType) {
            return _core2.default.Container.convertTo(v, enumType);
        },
        '$data.Duration': _core2.default.Container.proxyConverter,
        '$data.Day': _core2.default.Container.proxyConverter,
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter,
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter,
        "$data.Integer": _core2.default.Container.proxyConverter,
        "$data.Int32": _core2.default.Container.proxyConverter,
        "$data.Number": _core2.default.Container.proxyConverter,
        "$data.Date": function $dataDate(dbData) {
            return dbData != null ? new Date(dbData) : dbData;
        },
        "$data.DateTimeOffset": function $dataDateTimeOffset(dbData) {
            return dbData != null ? new Date(dbData) : dbData;
        },
        "$data.Time": _core2.default.Container.proxyConverter,
        "$data.String": _core2.default.Container.proxyConverter,
        "$data.Boolean": function $dataBoolean(b) {
            return _core.Guard.isNullOrUndefined(b) ? b : b === 1 ? true : false;
        },
        "$data.Blob": function $dataBlob(b) {
            return b ? _core2.default.Container.convertTo(atob(b), _core2.default.Blob) : b;
        },
        "$data.Array": function $dataArray() {
            if (arguments.length == 0) return [];
            return arguments[0] ? JSON.parse(arguments[0]) : undefined;
        },
        "$data.Object": function $dataObject(v) {
            try {
                return JSON.parse(v);
            } catch (err) {
                return v;
            }
        },
        "$data.Guid": function $dataGuid(g) {
            return g ? _core2.default.parseGuid(g).toString() : g;
        },
        '$data.GeographyPoint': function $dataGeographyPoint(g) {
            if (g) {
                return new _core2.default.GeographyPoint(JSON.parse(g));
            }return g;
        },
        '$data.GeographyLineString': function $dataGeographyLineString(g) {
            if (g) {
                return new _core2.default.GeographyLineString(JSON.parse(g));
            }return g;
        },
        '$data.GeographyPolygon': function $dataGeographyPolygon(g) {
            if (g) {
                return new _core2.default.GeographyPolygon(JSON.parse(g));
            }return g;
        },
        '$data.GeographyMultiPoint': function $dataGeographyMultiPoint(g) {
            if (g) {
                return new _core2.default.GeographyMultiPoint(JSON.parse(g));
            }return g;
        },
        '$data.GeographyMultiLineString': function $dataGeographyMultiLineString(g) {
            if (g) {
                return new _core2.default.GeographyMultiLineString(JSON.parse(g));
            }return g;
        },
        '$data.GeographyMultiPolygon': function $dataGeographyMultiPolygon(g) {
            if (g) {
                return new _core2.default.GeographyMultiPolygon(JSON.parse(g));
            }return g;
        },
        '$data.GeographyCollection': function $dataGeographyCollection(g) {
            if (g) {
                return new _core2.default.GeographyCollection(JSON.parse(g));
            }return g;
        },
        '$data.GeometryPoint': function $dataGeometryPoint(g) {
            if (g) {
                return new _core2.default.GeometryPoint(JSON.parse(g));
            }return g;
        },
        '$data.GeometryLineString': function $dataGeometryLineString(g) {
            if (g) {
                return new _core2.default.GeometryLineString(JSON.parse(g));
            }return g;
        },
        '$data.GeometryPolygon': function $dataGeometryPolygon(g) {
            if (g) {
                return new _core2.default.GeometryPolygon(JSON.parse(g));
            }return g;
        },
        '$data.GeometryMultiPoint': function $dataGeometryMultiPoint(g) {
            if (g) {
                return new _core2.default.GeometryMultiPoint(JSON.parse(g));
            }return g;
        },
        '$data.GeometryMultiLineString': function $dataGeometryMultiLineString(g) {
            if (g) {
                return new _core2.default.GeometryMultiLineString(JSON.parse(g));
            }return g;
        },
        '$data.GeometryMultiPolygon': function $dataGeometryMultiPolygon(g) {
            if (g) {
                return new _core2.default.GeometryMultiPolygon(JSON.parse(g));
            }return g;
        },
        '$data.GeometryCollection': function $dataGeometryCollection(g) {
            if (g) {
                return new _core2.default.GeometryCollection(JSON.parse(g));
            }return g;
        }
    },
    toDb: {
        '$data.Enum': _core2.default.Container.proxyConverter,
        '$data.Duration': _core2.default.Container.proxyConverter,
        '$data.Day': _core2.default.Container.proxyConverter,
        '$data.Byte': _core2.default.Container.proxyConverter,
        '$data.SByte': _core2.default.Container.proxyConverter,
        '$data.Decimal': _core2.default.Container.proxyConverter,
        '$data.Float': _core2.default.Container.proxyConverter,
        '$data.Int16': _core2.default.Container.proxyConverter,
        '$data.Int64': _core2.default.Container.proxyConverter,
        "$data.Integer": _core2.default.Container.proxyConverter,
        "$data.Int32": _core2.default.Container.proxyConverter,
        "$data.Number": _core2.default.Container.proxyConverter,
        "$data.Date": function $dataDate(date) {
            return date ? date.valueOf() : null;
        },
        "$data.DateTimeOffset": function $dataDateTimeOffset(date) {
            return date ? date.valueOf() : null;
        },
        "$data.Time": _core2.default.Container.proxyConverter,
        "$data.String": _core2.default.Container.proxyConverter,
        "$data.Boolean": function $dataBoolean(b) {
            return _core.Guard.isNullOrUndefined(b) ? b : b ? 1 : 0;
        },
        "$data.Blob": function $dataBlob(b) {
            return b ? _core2.default.Blob.toBase64(b) : b;
        },
        "$data.Array": function $dataArray(arr) {
            return arr ? JSON.stringify(arr) : arr;
        },
        "$data.Guid": function $dataGuid(g) {
            return g ? g.toString() : g;
        },
        "$data.Object": function $dataObject(value) {
            if (value === null) {
                return null;
            } else {
                JSON.stringify(value);
            }
        },
        '$data.GeographyPoint': function $dataGeographyPoint(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeographyLineString': function $dataGeographyLineString(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeographyPolygon': function $dataGeographyPolygon(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeographyMultiPoint': function $dataGeographyMultiPoint(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeographyMultiLineString': function $dataGeographyMultiLineString(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeographyMultiPolygon': function $dataGeographyMultiPolygon(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeographyCollection': function $dataGeographyCollection(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeometryPoint': function $dataGeometryPoint(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeometryLineString': function $dataGeometryLineString(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeometryPolygon': function $dataGeometryPolygon(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeometryMultiPoint': function $dataGeometryMultiPoint(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeometryMultiLineString': function $dataGeometryMultiLineString(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeometryMultiPolygon': function $dataGeometryMultiPolygon(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        },
        '$data.GeometryCollection': function $dataGeometryCollection(g) {
            if (g) {
                return JSON.stringify(g);
            }return g;
        }
    }
};

_core2.default.SqLiteFieldMapping = {
    '$data.Byte': "INTEGER",
    '$data.SByte': "INTEGER",
    '$data.Decimal': "TEXT",
    '$data.Float': "REAL",
    '$data.Int16': "INTEGER",
    '$data.Int64': "TEXT",
    "$data.Integer": "INTEGER",
    "$data.Int32": "INTEGER",
    "$data.Number": "REAL",
    "$data.Date": "REAL",
    "$data.Duration": "TEXT",
    "$data.Time": "TEXT",
    "$data.Day": "TEXT",
    "$data.DateTimeOffset": "REAL",
    "$data.String": "TEXT",
    "$data.Boolean": "INTEGER",
    "$data.Blob": "BLOB",
    "$data.Array": "TEXT",
    "$data.Guid": "TEXT",
    "$data.Object": "TEXT",
    '$data.GeographyPoint': "TEXT",
    '$data.GeographyLineString': "TEXT",
    '$data.GeographyPolygon': "TEXT",
    '$data.GeographyMultiPoint': "TEXT",
    '$data.GeographyMultiLineString': "TEXT",
    '$data.GeographyMultiPolygon': "TEXT",
    '$data.GeographyCollection': "TEXT",
    '$data.GeometryPoint': "TEXT",
    '$data.GeometryLineString': "TEXT",
    '$data.GeometryPolygon': "TEXT",
    '$data.GeometryMultiPoint': "TEXT",
    '$data.GeometryMultiLineString': "TEXT",
    '$data.GeometryMultiPolygon': "TEXT",
    '$data.GeometryCollection': "TEXT"
};