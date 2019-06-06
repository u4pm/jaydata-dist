'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* $data.SimpleBase */
_TypeSystem2.default.SimpleBase = function SimpleBase(data) {
    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data) {
        if (Array.isArray(this.constructor.validMembers)) {
            for (var i = 0; i < this.constructor.validMembers.length; i++) {
                var name = this.constructor.validMembers[i];

                if (data[name] !== undefined) {
                    this[name] = data[name];
                }
            }
        } else {
            delete data.type;
            _TypeSystem2.default.typeSystem.extend(this, data);
        }
    }
};
_TypeSystem2.default.SimpleBase.registerType = function (name, type, base) {
    base = base || _TypeSystem2.default.SimpleBase;

    type.type = name;
    type.prototype = Object.create(base.prototype);
    type.prototype.constructor = type;
};
_TypeSystem2.default.Container.registerType(['$data.SimpleBase', 'SimpleBase'], _TypeSystem2.default.SimpleBase);

exports.default = _TypeSystem2.default;
module.exports = exports['default'];