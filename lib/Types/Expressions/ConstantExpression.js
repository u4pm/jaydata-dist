'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ConstantExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(value, type, name, elementType) {
        this.value = value;
        //TODO
        //this.type = Container.getTypeName(value);

        this.type = type;
        this.name = name;
        this.elementType = elementType;
        if (!_index.Guard.isNullOrUndefined(this.value)) {
            this.type = _index.Container.resolveType(this.type);
            if (this.type === _index2.default.Array && this.elementType || _index.Container.resolveType(_index.Container.getTypeName(this.value)) !== this.type) this.value = _index.Container.convertTo(value, this.type, this.elementType);
        }
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Constant, enumerable: true },
    type: { value: Object, writable: true },
    elementType: { value: Object, writable: true },
    value: { value: undefined, writable: true },
    toString: function toString(debug) {
        //return "[constant: " + this.value.toString() + "]";
        return this.value.toString();
    }
});

exports.default = _index2.default;
module.exports = exports['default'];