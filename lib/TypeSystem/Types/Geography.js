'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

var _jaydataErrorHandler = require('jaydata-error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* $data.GeographyBase */
_TypeSystem2.default.GeographyBase = function GeographyBase() {
    _TypeSystem2.default.Geospatial.apply(this, arguments);

    this.crs = this.crs || _TypeSystem2.default.GeographyBase.defaultCrs;
    _TypeSystem2.default.GeographyBase.validateGeoJSON(this);
};

_TypeSystem2.default.GeographyBase.disableSRID = false;
_TypeSystem2.default.GeographyBase.defaultCrs = {
    properties: {
        name: 'EPSG:4326'
    },
    type: 'name'
};

_TypeSystem2.default.GeographyBase.parseFromString = function (strData) {
    var lparenIdx = strData.indexOf('(');
    if (lparenIdx >= 0) {
        var name = strData.substring(0, lparenIdx).toLowerCase();
        var type = _TypeSystem2.default.GeographyBase.registered[name];

        if (type && type.parseFromString && type != _TypeSystem2.default.GeographyBase) {
            return type.parseFromString(strData);
        } else {
            _jaydataErrorHandler.Guard.raise(new _jaydataErrorHandler.Exception('parseFromString', 'Not Implemented', strData));
        }
    }
};
_TypeSystem2.default.GeographyBase.stringifyToUrl = function (geoData) {
    if (geoData instanceof _TypeSystem2.default.GeographyBase && geoData.constructor && geoData.constructor.stringifyToUrl) {
        return geoData.constructor.stringifyToUrl(geoData);
    } else if (geoData instanceof _TypeSystem2.default.GeographyBase && geoData.constructor && Array.isArray(geoData.constructor.validMembers) && geoData.constructor.validMembers[0] === 'coordinates') {
        var getSRID = function getSRID(g) {
            if (!_TypeSystem2.default.GeographyBase.disableSRID && g.crs && g.crs.properties && g.crs.properties.name) {
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

        var data = "geography'";

        data = getSRID(geoData);
        data += geoData.type + '(';

        data = buildArray(geoData.coordinates);

        data += ")'";
        return data;
    } else {
        _jaydataErrorHandler.Guard.raise(new _jaydataErrorHandler.Exception('stringifyToUrl on instance type', 'Not Implemented', geoData));
    }
};
_TypeSystem2.default.GeographyBase.registerType = function (name, type, base) {
    _TypeSystem2.default.SimpleBase.registerType(name, type, base || _TypeSystem2.default.GeographyBase);

    _TypeSystem2.default.GeographyBase.registered = _TypeSystem2.default.GeographyBase.registered || {};
    _TypeSystem2.default.GeographyBase.registered[name.toLowerCase()] = type;
};
_TypeSystem2.default.GeographyBase.validateGeoJSON = function (geoData) {
    var type = geoData.type;
    if (type) {
        var geoType = _TypeSystem2.default.GeographyBase.registered[type.toLowerCase()];
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
_TypeSystem2.default.SimpleBase.registerType('GeographyBase', _TypeSystem2.default.GeographyBase, _TypeSystem2.default.Geospatial);
_TypeSystem2.default.Container.registerType(['$data.GeographyBase'], _TypeSystem2.default.GeographyBase);

/* $data.GeographyPoint */
_TypeSystem2.default.GeographyPoint = function GeographyPoint(lon, lat) {
    if (lon && (typeof lon === 'undefined' ? 'undefined' : _typeof(lon)) === 'object' && Array.isArray(lon)) {
        _TypeSystem2.default.GeographyBase.call(this, { coordinates: lon });
    } else if (lon && (typeof lon === 'undefined' ? 'undefined' : _typeof(lon)) === 'object' && ('longitude' in lon || 'latitude' in lon)) {
        _TypeSystem2.default.GeographyBase.call(this, { coordinates: [lon.longitude, lon.latitude] });
    } else if (lon && (typeof lon === 'undefined' ? 'undefined' : _typeof(lon)) === 'object' && ('lng' in lon || 'lat' in lon)) {
        _TypeSystem2.default.GeographyBase.call(this, { coordinates: [lon.lng, lon.lat] });
    } else if (lon && (typeof lon === 'undefined' ? 'undefined' : _typeof(lon)) === 'object') {
        _TypeSystem2.default.GeographyBase.call(this, lon);
    } else {
        _TypeSystem2.default.GeographyBase.call(this, { coordinates: [lon || 0, lat || 0] });
    }
};
_TypeSystem2.default.GeographyPoint.validateGeoJSON = function (geoData) {
    return geoData && Array.isArray(geoData.coordinates) && geoData.coordinates.length == 2 && typeof geoData.coordinates[0] === 'number' && typeof geoData.coordinates[1] === 'number';
};
_TypeSystem2.default.GeographyPoint.parseFromString = function (strData) {
    var data = strData.substring(strData.indexOf('(') + 1, strData.lastIndexOf(')'));
    var values = data.split(' ');

    return new _TypeSystem2.default.GeographyPoint(parseFloat(values[0]), parseFloat(values[1]));
};
_TypeSystem2.default.GeographyPoint.validMembers = ['coordinates'];
_TypeSystem2.default.GeographyBase.registerType('Point', _TypeSystem2.default.GeographyPoint);
Object.defineProperty(_TypeSystem2.default.GeographyPoint.prototype, 'longitude', { get: function get() {
        return this.coordinates[0];
    }, set: function set(v) {
        this.coordinates[0] = v;
    } });
Object.defineProperty(_TypeSystem2.default.GeographyPoint.prototype, 'latitude', { get: function get() {
        return this.coordinates[1];
    }, set: function set(v) {
        this.coordinates[1] = v;
    } });
_TypeSystem2.default.Container.registerType(['$data.GeographyPoint', 'GeographyPoint', '$data.Geography', 'Geography', 'geography', 'geo'], _TypeSystem2.default.GeographyPoint);
_TypeSystem2.default.Geography = _TypeSystem2.default.GeographyPoint;

/* $data.GeographyLineString */
_TypeSystem2.default.GeographyLineString = function GeographyLineString(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeographyBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeographyBase.call(this, data);
    }
};
_TypeSystem2.default.GeographyLineString.validateGeoJSON = function (geoData) {
    var isValid = geoData && Array.isArray(geoData.coordinates);

    for (var i = 0; isValid && i < geoData.coordinates.length; i++) {
        var point = geoData.coordinates[i];
        isValid = isValid && Array.isArray(point) && point.length == 2 && typeof point[0] === 'number' && typeof point[1] === 'number';
    }

    return isValid;
};
_TypeSystem2.default.GeographyLineString.validMembers = ['coordinates'];
_TypeSystem2.default.GeographyBase.registerType('LineString', _TypeSystem2.default.GeographyLineString);
_TypeSystem2.default.Container.registerType(['$data.GeographyLineString', 'GeographyLineString'], _TypeSystem2.default.GeographyLineString);

/* $data.GeographyPolygon */
_TypeSystem2.default.GeographyPolygon = function GeographyPolygon(data) {
    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && ('topLeft' in data && 'bottomRight' in data || 'topRight' in data && 'bottomLeft' in data)) {
        var tl, tr, bl, br;

        if ('topLeft' in data && 'bottomRight' in data) {
            tl = data.topLeft instanceof _TypeSystem2.default.GeographyPoint ? data.topLeft : new _TypeSystem2.default.GeographyPoint(data.topLeft);
            br = data.bottomRight instanceof _TypeSystem2.default.GeographyPoint ? data.bottomRight : new _TypeSystem2.default.GeographyPoint(data.bottomRight);
            tr = new _TypeSystem2.default.GeographyPoint([br.coordinates[0], tl.coordinates[1]]);
            bl = new _TypeSystem2.default.GeographyPoint([tl.coordinates[0], br.coordinates[1]]);
        } else {
            tr = data.topRight instanceof _TypeSystem2.default.GeographyPoint ? data.topRight : new _TypeSystem2.default.GeographyPoint(data.topRight);
            bl = data.bottomLeft instanceof _TypeSystem2.default.GeographyPoint ? data.bottomLeft : new _TypeSystem2.default.GeographyPoint(data.bottomLeft);
            tl = new _TypeSystem2.default.GeographyPoint([bl.coordinates[0], tr.coordinates[1]]);
            br = new _TypeSystem2.default.GeographyPoint([tr.coordinates[0], bl.coordinates[1]]);
        }

        var coordinates = [];
        coordinates.push([].concat(tl.coordinates));
        coordinates.push([].concat(tr.coordinates));
        coordinates.push([].concat(br.coordinates));
        coordinates.push([].concat(bl.coordinates));
        coordinates.push([].concat(tl.coordinates));

        _TypeSystem2.default.GeographyBase.call(this, { coordinates: [coordinates] });
    } else if (Array.isArray(data)) {
        _TypeSystem2.default.GeographyBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeographyBase.call(this, data);
    }
};
_TypeSystem2.default.GeographyPolygon.validateGeoJSON = function (geoData) {
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
_TypeSystem2.default.GeographyPolygon.parseFromString = function (strData) {
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

    return new _TypeSystem2.default.GeographyPolygon(data);
};
_TypeSystem2.default.GeographyPolygon.validMembers = ['coordinates'];
_TypeSystem2.default.GeographyBase.registerType('Polygon', _TypeSystem2.default.GeographyPolygon);
_TypeSystem2.default.Container.registerType(['$data.GeographyPolygon', 'GeographyPolygon'], _TypeSystem2.default.GeographyPolygon);

/* $data.GeographyMultiPoint */
_TypeSystem2.default.GeographyMultiPoint = function GeographyMultiPoint(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeographyBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeographyBase.call(this, data);
    }
};
_TypeSystem2.default.GeographyMultiPoint.validateGeoJSON = function (geoData) {
    var isValid = geoData && Array.isArray(geoData.coordinates);

    for (var i = 0; isValid && i < geoData.coordinates.length; i++) {
        var point = geoData.coordinates[i];
        isValid = isValid && Array.isArray(point) && point.length == 2 && typeof point[0] === 'number' && typeof point[1] === 'number';
    }

    return isValid;
};
_TypeSystem2.default.GeographyMultiPoint.validMembers = ['coordinates'];
_TypeSystem2.default.GeographyBase.registerType('MultiPoint', _TypeSystem2.default.GeographyMultiPoint);
_TypeSystem2.default.Container.registerType(['$data.GeographyMultiPoint', 'GeographyMultiPoint'], _TypeSystem2.default.GeographyMultiPoint);

/* $data.GeographyMultiLineString */
_TypeSystem2.default.GeographyMultiLineString = function GeographyMultiLineString(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeographyBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeographyBase.call(this, data);
    }
};
_TypeSystem2.default.GeographyMultiLineString.validateGeoJSON = function (geoData) {
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
_TypeSystem2.default.GeographyMultiLineString.validMembers = ['coordinates'];
_TypeSystem2.default.GeographyBase.registerType('MultiLineString', _TypeSystem2.default.GeographyMultiLineString);
_TypeSystem2.default.Container.registerType(['$data.GeographyMultiLineString', 'GeographyMultiLineString'], _TypeSystem2.default.GeographyMultiLineString);

/* $data.GeographyMultiPolygon */
_TypeSystem2.default.GeographyMultiPolygon = function GeographyMultiPolygon(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeographyBase.call(this, { coordinates: data });
    } else {
        _TypeSystem2.default.GeographyBase.call(this, data);
    }
};
_TypeSystem2.default.GeographyMultiPolygon.validateGeoJSON = function (geoData) {
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
_TypeSystem2.default.GeographyMultiPolygon.validMembers = ['coordinates'];
_TypeSystem2.default.GeographyBase.registerType('MultiPolygon', _TypeSystem2.default.GeographyMultiPolygon);
_TypeSystem2.default.Container.registerType(['$data.GeographyMultiPolygon', 'GeographyMultiPolygon'], _TypeSystem2.default.GeographyMultiPolygon);

/* $data.GeographyCollection */
_TypeSystem2.default.GeographyCollection = function GeographyCollection(data) {
    if (Array.isArray(data)) {
        _TypeSystem2.default.GeographyBase.call(this, { geometries: data });
    } else {
        _TypeSystem2.default.GeographyBase.call(this, data);
    }
};
_TypeSystem2.default.GeographyCollection.validateGeoJSON = function (geoData) {
    var isValid = geoData && Array.isArray(geoData.geometries);

    for (var i = 0; isValid && i < geoData.geometries.length; i++) {
        var geometry = geoData.geometries[i];
        try {
            isValid = isValid && _TypeSystem2.default.GeographyBase.validateGeoJSON(geometry);
        } catch (e) {
            isValid = false;
        }
    }

    return isValid;
};
_TypeSystem2.default.GeographyCollection.validMembers = ['geometries'];
_TypeSystem2.default.GeographyBase.registerType('GeometryCollection', _TypeSystem2.default.GeographyCollection);
_TypeSystem2.default.Container.registerType(['$data.GeographyCollection', 'GeographyCollection'], _TypeSystem2.default.GeographyCollection);

/* converters */
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeographyPoint, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeographyPoint(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeographyLineString, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeographyLineString(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeographyPolygon, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeographyPolygon(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeographyMultiPoint, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeographyMultiPoint(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeographyMultiLineString, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeographyMultiLineString(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeographyMultiPolygon, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeographyMultiPolygon(value) : value;
});
_TypeSystem2.default.Container.registerConverter(_TypeSystem2.default.GeographyCollection, _TypeSystem2.default.Object, function (value) {
    return value ? new _TypeSystem2.default.GeographyCollection(value) : value;
});

exports.default = _TypeSystem2.default;
module.exports = exports['default'];