'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

var _jaydataErrorHandler = require('jaydata-error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* $data.Geometry */
_TypeSystem2.default.GeometryBase = function GeometryBase() {
    _TypeSystem2.default.Geospatial.apply(this, arguments);

    this.crs = this.crs || _TypeSystem2.default.GeometryBase.defaultCrs;
    _TypeSystem2.default.GeometryBase.validateGeoJSON(this);
};

_TypeSystem2.default.GeometryBase.disableSRID = false;
_TypeSystem2.default.GeometryBase.defaultCrs = {
    properties: {
        name: 'EPSG:0'
    },
    type: 'name'
};

_TypeSystem2.default.GeometryBase.parseFromString = function (strData) {
    var lparenIdx = strData.indexOf('(');
    if (lparenIdx >= 0) {
        var name = strData.substring(0, lparenIdx).toLowerCase();
        var type = _TypeSystem2.default.GeometryBase.registered[name];

        if (type && type.parseFromString && type != _TypeSystem2.default.GeometryBase) {
            return type.parseFromString(strData);
        } else {
            _jaydataErrorHandler.Guard.raise(new _jaydataErrorHandler.Exception('parseFromString', 'Not Implemented', strData));
        }
    }
};
_TypeSystem2.default.GeometryBase.stringifyToUrl = function (geoData) {
    if (geoData instanceof _TypeSystem2.default.GeometryBase && geoData.constructor && geoData.constructor.stringifyToUrl) {
        return geoData.constructor.stringifyToUrl(geoData);
    } else if (geoData instanceof _TypeSystem2.default.GeometryBase && geoData.constructor && Array.isArray(geoData.constructor.validMembers) && geoData.constructor.validMembers[0] === 'coordinates') {
        var getSRID = function getSRID(g) {
            if (!_TypeSystem2.default.GeometryBase.disableSRID && g.crs && g.crs.properties && g.crs.properties.name) {
                var r = /EPSG:(\d+)/i;
                var matches = r.exec(g.crs.properties.name);
                if (matches) {
                    data += "SRID=" + matches[1] + ";";
                }
            }
            return data;
        };

        var buildArray = function buildArray(d) {
            if (Array.isArray(d[0])) {

                for (var i = 0; i < d.length; i++) {
                    if (i > 0) data += ',';
                    if (Array.isArray(d[i][0])) data += '(';

                    buildArray(d[i]);

                    if (Array.isArray(d[i][0])) data += ')';
                }
            } else {
                data += d.join(' ');
            }
            return data;
        };

        var data = "geometry'";

        data = getSRID(geoData);
        data += geoData.type + '(';

        data = buildArray(geoData.coordinates);

        data += ")'";
        return data;
    } else {
        _jaydataErrorHandler.Guard.raise(new _jaydataErrorHandler.Exception('stringifyToUrl on instance type', 'Not Implemented', geoData));
    }
};
_TypeSystem2.default.GeometryBase.registerType = function (name, type, base) {
    _TypeSystem2.default.SimpleBase.registerType(name, type, base || _TypeSystem2.default.GeometryBase);

    _TypeSystem2.default.GeometryBase.registered = _TypeSystem2.default.GeometryBase.registered || {};
    _TypeSystem2.default.GeometryBase.registered[name.toLowerCase()] = type;
};
_TypeSystem2.default.GeometryBase.validateGeoJSON = function (geoData) {
    var type = geoData.type;
    if (type) {
        var geoType = _TypeSystem2.default.GeometryBase.registered[type.toLowerCase()];
        if (typeof geoType.validateGeoJSON === 'function') {
            var isValid = geoType.validateGeoJSON(geoData);
            if (isValid) {
                return isValid;
            } else {
                _jaydataErrorHandler.Guard.raise(new _jaydataErrorHandler.Exception("Invalid '" + type + "' format!", 'Format Exception', geoData));
            }
        }
    }
    console.log('GeoJSON validation missing', geoData);
    return;
};
_TypeSystem2.default.SimpleBase.registerType('GeometryBase', _TypeSystem2.default.GeometryBase, _TypeSystem2.default.Geospatial);
_TypeSystem2.default.Container.registerType(['$data.GeometryBase'], _TypeSystem2.default.GeometryBase);

/* $data.GeometryPoint */
_TypeSystem2.default.GeometryPoint = function GeometryPoint(x, y) {
    var param = x;
    if (param && (typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object' && Array.isArray(param)) {
        _TypeSystem2.default.GeometryBase.call(this, { coordinates: param });
    } else if (param && (typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object' && ('x' in param || 'y' in param)) {
        _TypeSystem2.default.GeometryBase.call(this, { coordinates: [param.x, param.y] });
    } else if (param && (typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
        _TypeSystem2.default.GeometryBase.call(this, param);
    } else {
        _TypeSystem2.default.GeometryBase.call(this, { coordinates: [x || 0, y || 0] });
    }
};
_TypeSystem2.default.GeometryPoint.validateGeoJSON = function (geoData) {
    return geoData && Array.isArray(geoData.coordinates) && geoData.coordinates.length == 2 && typeof geoData.coordinates[0] === 'number' && typeof geoData.coordinates[1] === 'number';
};
_TypeSystem2.default.GeometryPoint.parseFromString = function (strData) {
    var data = strData.substring(strData.indexOf('(') + 1, strData.lastIndexOf(')'));
    var values = data.split(' ');

    return new _TypeSystem2.default.GeometryPoint(parseFloat(values[0]), parseFloat(values[1]));
};
_TypeSystem2.default.GeometryPoint.validMembers = ['coordinates'];
_TypeSystem2.default.GeometryBase.registerType('Point', _TypeSystem2.default.GeometryPoint);
Object.defineProperty(_TypeSystem2.default.GeometryPoint.prototype, 'x', { get: function get() {
        return this.coordinates[0];
    }, set: function set(v) {
        this.coordinates[0] = v;
    } });
Object.defineProperty(_TypeSystem2.default.GeometryPoint.prototype, 'y', { get: function get() {
        return this.coordinates[1];
    }, set: function set(v) {
        this.coordinates[1] = v;
    } });
_TypeSystem2.default.Container.registerType(['$data.GeometryPoint', 'GeometryPoint'], _TypeSystem2.default.GeometryPoint);

/* $data.GeometryLineString */
_TypeSystem2.default.GeometryLineString = function GeometryLineString(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeometryBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeometryBase.call(this, data);
    }
};
_TypeSystem2.default.GeometryLineString.validateGeoJSON = function (geoData) {
    var isValid = geoData && Array.isArray(geoData.coordinates);

    for (var i = 0; isValid && i < geoData.coordinates.length; i++) {
        var point = geoData.coordinates[i];
        isValid = isValid && Array.isArray(point) && point.length == 2 && typeof point[0] === 'number' && typeof point[1] === 'number';
    }

    return isValid;
};
_TypeSystem2.default.GeometryLineString.validMembers = ['coordinates'];
_TypeSystem2.default.GeometryBase.registerType('LineString', _TypeSystem2.default.GeometryLineString);
_TypeSystem2.default.Container.registerType(['$data.GeometryLineString', 'GeometryLineString'], _TypeSystem2.default.GeometryLineString);

/* $data.GeometryPolygon */
_TypeSystem2.default.GeometryPolygon = function GeometryPolygon(data) {
    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && ('topLeft' in data && 'bottomRight' in data || 'topRight' in data && 'bottomLeft' in data)) {
        var tl, tr, bl, br;

        if ('topLeft' in data && 'bottomRight' in data) {
            tl = data.topLeft instanceof _TypeSystem2.default.GeometryPoint ? data.topLeft : new _TypeSystem2.default.GeometryPoint(data.topLeft);
            br = data.bottomRight instanceof _TypeSystem2.default.GeometryPoint ? data.bottomRight : new _TypeSystem2.default.GeometryPoint(data.bottomRight);
            tr = new _TypeSystem2.default.GeometryPoint([br.coordinates[0], tl.coordinates[1]]);
            bl = new _TypeSystem2.default.GeometryPoint([tl.coordinates[0], br.coordinates[1]]);
        } else {
            tr = data.topRight instanceof _TypeSystem2.default.GeometryPoint ? data.topRight : new _TypeSystem2.default.GeometryPoint(data.topRight);
            bl = data.bottomLeft instanceof _TypeSystem2.default.GeometryPoint ? data.bottomLeft : new _TypeSystem2.default.GeometryPoint(data.bottomLeft);
            tl = new _TypeSystem2.default.GeometryPoint([bl.coordinates[0], tr.coordinates[1]]);
            br = new _TypeSystem2.default.GeometryPoint([tr.coordinates[0], bl.coordinates[1]]);
        }

        var coordinates = [];
        coordinates.push([].concat(tl.coordinates));
        coordinates.push([].concat(tr.coordinates));
        coordinates.push([].concat(br.coordinates));
        coordinates.push([].concat(bl.coordinates));
        coordinates.push([].concat(tl.coordinates));

        _TypeSystem2.default.GeometryBase.call(this, { coordinates: [coordinates] });
    } else if (Array.isArray(data)) {
        _TypeSystem2.default.GeometryBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeometryBase.call(this, data);
    }
};
_TypeSystem2.default.GeometryPolygon.validateGeoJSON = function (geoData) {
    var isValid = geoData && Array.isArray(geoData.coordinates);

    for (var i = 0; isValid && i < geoData.coordinates.length; i++) {
        var polygon = geoData.coordinates[i];
        var isValid = isValid && Array.isArray(polygon);

        for (var j = 0; isValid && j < polygon.length; j++) {
            var point = polygon[j];

            isValid = isValid && Array.isArray(point) && point.length == 2 && typeof point[0] === 'number' && typeof point[1] === 'number';
        }
    }

    return isValid;
};
_TypeSystem2.default.GeometryPolygon.parseFromString = function (strData) {
    var data = strData.substring(strData.indexOf('(') + 1, strData.lastIndexOf(')'));
    var rings = data.substring(data.indexOf('(') + 1, data.lastIndexOf(')')).split('),(');

    var data = [];
    for (var i = 0; i < rings.length; i++) {
        var polyPoints = [];
        var pairs = rings[i].split(',');
        for (var j = 0; j < pairs.length; j++) {
            var values = pairs[j].split(' ');

            polyPoints.push([parseFloat(values[0]), parseFloat(values[1])]);
        }
        data.push(polyPoints);
    }

    return new _TypeSystem2.default.GeometryPolygon(data);
};
_TypeSystem2.default.GeometryPolygon.validMembers = ['coordinates'];
_TypeSystem2.default.GeometryBase.registerType('Polygon', _TypeSystem2.default.GeometryPolygon);
_TypeSystem2.default.Container.registerType(['$data.GeometryPolygon', 'GeometryPolygon'], _TypeSystem2.default.GeometryPolygon);

/* $data.GeometryMultiPoint */
_TypeSystem2.default.GeometryMultiPoint = function GeometryMultiPoint(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeometryBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeometryBase.call(this, data);
    }
};
_TypeSystem2.default.GeometryMultiPoint.validateGeoJSON = function (geoData) {
    var isValid = geoData && Array.isArray(geoData.coordinates);

    for (var i = 0; isValid && i < geoData.coordinates.length; i++) {
        var point = geoData.coordinates[i];
        isValid = isValid && Array.isArray(point) && point.length == 2 && typeof point[0] === 'number' && typeof point[1] === 'number';
    }

    return isValid;
};
_TypeSystem2.default.GeometryMultiPoint.validMembers = ['coordinates'];
_TypeSystem2.default.GeometryBase.registerType('MultiPoint', _TypeSystem2.default.GeometryMultiPoint);
_TypeSystem2.default.Container.registerType(['$data.GeometryMultiPoint', 'GeometryMultiPoint'], _TypeSystem2.default.GeometryMultiPoint);

/* $data.GeometryMultiLineString */
_TypeSystem2.default.GeometryMultiLineString = function GeometryMultiLineString(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeometryBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeometryBase.call(this, data);
    }
};
_TypeSystem2.default.GeometryMultiLineString.validateGeoJSON = function (geoData) {
    var isValid = geoData && Array.isArray(geoData.coordinates);

    for (var i = 0; isValid && i < geoData.coordinates.length; i++) {
        var polygon = geoData.coordinates[i];
        var isValid = isValid && Array.isArray(polygon);

        for (var j = 0; isValid && j < polygon.length; j++) {
            var point = polygon[j];

            isValid = isValid && Array.isArray(point) && point.length == 2 && typeof point[0] === 'number' && typeof point[1] === 'number';
        }
    }

    return isValid;
};
_TypeSystem2.default.GeometryMultiLineString.validMembers = ['coordinates'];
_TypeSystem2.default.GeometryBase.registerType('MultiLineString', _TypeSystem2.default.GeometryMultiLineString);
_TypeSystem2.default.Container.registerType(['$data.GeometryMultiLineString', 'GeometryMultiLineString'], _TypeSystem2.default.GeometryMultiLineString);

/* $data.GeometryMultiPolygon */
_TypeSystem2.default.GeometryMultiPolygon = function GeometryMultiPolygon(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeometryBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeometryBase.call(this, data);
    }
};
_TypeSystem2.default.GeometryMultiPolygon.validateGeoJSON = function (geoData) {
    var isValid = geoData && Array.isArray(geoData.coordinates);

    for (var k = 0; isValid && k < geoData.coordinates.length; k++) {
        var polygons = geoData.coordinates[k];
        var isValid = isValid && Array.isArray(polygons);

        for (var i = 0; isValid && i < polygons.length; i++) {
            var polygon = polygons[i];
            var isValid = isValid && Array.isArray(polygon);

            for (var j = 0; isValid && j < polygon.length; j++) {
                var point = polygon[j];

                isValid = isValid && Array.isArray(point) && point.length == 2 && typeof point[0] === 'number' && typeof point[1] === 'number';
            }
        }
    }

    return isValid;
};
_TypeSystem2.default.GeometryMultiPolygon.validMembers = ['coordinates'];
_TypeSystem2.default.GeometryBase.registerType('MultiPolygon', _TypeSystem2.default.GeometryMultiPolygon);
_TypeSystem2.default.Container.registerType(['$data.GeometryMultiPolygon', 'GeometryMultiPolygon'], _TypeSystem2.default.GeometryMultiPolygon);

/* $data.GeometryCollection */
_TypeSystem2.default.GeometryCollection = function GeometryCollection(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeometryBase.call(this, { geometries: data });
    } else {
        _TypeSystem2.default.GeometryBase.call(this, data);
    }
};
_TypeSystem2.default.GeometryCollection.validateGeoJSON = function (geoData) {
    var isValid = geoData && Array.isArray(geoData.geometries);

    for (var i = 0; isValid && i < geoData.geometries.length; i++) {
        var geometry = geoData.geometries[i];
        try {
            isValid = isValid && _TypeSystem2.default.GeometryBase.validateGeoJSON(geometry);
        } catch (e) {
            isValid = false;
        }
    }

    return isValid;
};
_TypeSystem2.default.GeometryCollection.validMembers = ['geometries'];
_TypeSystem2.default.GeometryBase.registerType('GeometryCollection', _TypeSystem2.default.GeometryCollection);
_TypeSystem2.default.Container.registerType(['$data.GeometryCollection', 'GeometryCollection'], _TypeSystem2.default.GeometryCollection);

/* converters */
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeometryPoint, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeometryPoint(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeometryLineString, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeometryLineString(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeometryPolygon, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeometryPolygon(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeometryMultiPoint, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeometryMultiPoint(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeometryMultiLineString, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeometryMultiLineString(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeometryMultiPolygon, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeometryMultiPolygon(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeometryCollection, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeometryCollection(value) : value;
});

exports.default = _TypeSystem2.default;
module.exports = exports['default'];