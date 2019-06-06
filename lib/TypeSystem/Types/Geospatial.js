'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_TypeSystem2.default.Geospatial = function Geospatial() {
    this.type = this.constructor.type;
    if (Array.isArray(this.constructor.validMembers)) {
        for (var i = 0; i < this.constructor.validMembers.length; i++) {
            var name = this.constructor.validMembers[i];
            this[name] = undefined;
        }
    }

    _TypeSystem2.default.SimpleBase.apply(this, arguments);
    this.type = this.constructor.type || 'Unknown';
};
_TypeSystem2.default.SimpleBase.registerType('Geospatial', _TypeSystem2.default.Geospatial);
_TypeSystem2.default.Container.registerType(['$data.Geospatial', 'Geospatial'], _TypeSystem2.default.Geospatial);

_TypeSystem2.default.point = function (arg) {
    if (arg && arg.crs) {
        if (arg.crs.properties && arg.crs.properties.name === _TypeSystem2.default.GeometryBase.defaultCrs.properties.name) {
            return new _TypeSystem2.default.GeometryPoint(arg);
        } else {
            return new _TypeSystem2.default.GeographyPoint(arg);
        }
    } else if (arg) {
        if ('x' in arg && 'y' in arg) {
            return new _TypeSystem2.default.GeometryPoint(arg.x, arg.y);
        } else if ('longitude' in arg && 'latitude' in arg) {
            return new _TypeSystem2.default.GeographyPoint(arg.longitude, arg.latitude);
        } else if ('lng' in arg && 'lat' in arg) {
            return new _TypeSystem2.default.GeographyPoint(arg.lng, arg.lat);
        }
    }
};

exports.default = _TypeSystem2.default;
module.exports = exports['default'];