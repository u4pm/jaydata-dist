"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = require("jaydata/core");

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($data) {

    $data.Array.prototype.toQueryable = function () {
        if (this.length > 0) {
            var firtsItem = this[0];
            var type = _core.Container.resolveType(_core.Container.getTypeName(firtsItem));

            if (!type.isAssignableTo || !type.isAssignableTo($data.Entity)) _core.Guard.raise(new _core.Exception("Type '" + _core.Container.resolveName(type) + "' is not subclass of $data.Entity", "Not supported", type));

            for (var i = 0; i < this.length; i++) {
                _core.Guard.requireType('array item check', this[i], type);
            }
        }

        var typeName = 'inMemoryArray_' + type.name;
        if (!_core.Container.isTypeRegistered(typeName)) {
            $data.EntityContext.extend(typeName, {
                Source: {
                    type: $data.EntitySet,
                    elementType: type
                }
            });
        }

        var context = _core.Container['create' + typeName]({ name: 'InMemory', source: { Source: this } });

        return context.Source;
    };
})(_core2.default);

exports.default = _core2.default;
module.exports = exports['default'];