'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.SimpleBinaryExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(left, right, nodeType, operator, type, resolution) {
        ///<summary>Represents a bin operation with left and right operands and an operator///</summary>
        ///<param name="left" type="$data.Expression.ExpressionNode">The left element of the binary operation</param>
        ///<param name="right" type="$data.Expression.ExpressionNode">The right element of the binary operation</param>
        ///<field name="implementation" type="function" />
        this.left = left;
        this.right = right;
        this.nodeType = nodeType;
        this.operator = operator;
        this.type = type;
        this.resolution = resolution;
    },

    implementation: {
        get: function get() {
            return _index2.default.binaryOperators.getOperator(this.operator).implementation;
        },
        set: function set() {}

    },
    //nodeType: { value: $data.Expressions.ExpressionType },
    type: { value: "number", writable: true }
});

exports.default = _index2.default;
module.exports = exports['default'];