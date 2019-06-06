'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ArrayLiteralExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(items) {
        ///<param name="name" type="string" />
        ///<field name="name" type="string" />
        ///<field name="items" type="Array" elementType="$data.Expression.ExpressionNode" />
        this.items = items || [];
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.ArrayLiteral, writable: true },

    items: { value: undefined, dataType: Array, elementType: _index2.default.Expressions.ExpressionNode },

    toString: function toString(debug) {
        //var result;
        //result = debug ? this.type + " " : "";
        //result = result + this.name;
        ///<var nam
        var result = "[" + this.items.map(function (item) {
            return item.toString();
        }).join(",") + "]";
        return result;
    }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];