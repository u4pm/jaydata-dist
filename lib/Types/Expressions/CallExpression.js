'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.CallExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(expression, member, args) {
        ///<summary>Represents a call to an object or global method</summary>
        ///<field name="object" type="$data.Expressions.ExpressionNode">The expression for object that has the method</field>
        ///<field name="member" type="$data.MemberDefinition">The member descriptor</field>
        this.expression = expression;
        this.member = member;
        this.args = args;
    },

    nodeType: {
        value: _index2.default.Expressions.ExpressionType.Call
    },

    expression: {
        value: undefined,
        dataType: _index2.default.Expressions.ExpressionNode,
        writable: true
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

    implementation: {
        get: function get() {
            return function (thisObj, method, args) {
                if (typeof method !== 'function') {
                    method = thisObj[method];
                }
                _index.Guard.requireType("method", method, Function);
                return method.apply(thisObj, args);
            };
        },
        set: function set(value) {
            _index.Guard.raise("Property can not be set");
        }
    },

    toString: function toString(debug) {
        return this.object.toString() + "." + this.member.toString() + "(" + ")";
    }

});

exports.default = _index2.default;
module.exports = exports['default'];