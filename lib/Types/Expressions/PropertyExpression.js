'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.PropertyExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(expression, member) {
        ///<summary>Represents accessing a property or field of an object</summary>
        ///<param name="expression" type="$data.Expressions.ExpressionNode">The expression for the property owner object</param>
        ///<param name="member" type="$data.Expressions.ConstantExpression">The member descriptor</param>
        ///<field name="expression" type="$data.Expressions.ExpressionNode">The expression for the property owner object</field>
        ///<field name="member" type="$data.Expression.ConstantExpression">The member descriptor</field>

        this.expression = expression;
        this.member = member;

        this.type = member.dataType;
    },

    nodeType: {
        value: _index2.default.Expressions.ExpressionType.MemberAccess
    },

    expression: {
        value: undefined,
        dataType: _index2.default.Expressions.ExpressionNode,
        writable: true
    },

    implementation: {
        get: function get() {
            return function (holder, memberName) {
                if (holder[memberName] === undefined) _index.Guard.raise(new _index.Exception("Parameter '" + memberName + "' not found in context", 'Property not found!'));
                return holder[memberName];
            };
        },
        set: function set() {}
    },

    member: {
        value: undefined,
        dataType: _index2.default.MemberDefinition,
        writable: true
    },

    type: {
        value: undefined,
        writable: true
    },

    toString: function toString(debug) {
        return this.expression.toString() + "." + this.member.toString();
    }

});

exports.default = _index2.default;
module.exports = exports['default'];