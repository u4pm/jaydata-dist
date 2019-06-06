'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ObjectLiteralExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(members) {
        ///<summary>Represent an object initializer literal expression &#10;Ex: { prop: value}</summary>
        ///<param name="member" type="Array" elementType="$data.Expressions.ObjectFieldExpression" />
        this.members = members;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.ObjectLiteral, writable: true },

    toString: function toString(debug) {
        //var result;
        //result = debug ? this.type + " " : "";
        //result = result + this.name;
        var result = "unimplemented";
        return result;
    },

    implementation: {
        get: function get() {
            return function (namesAndValues) {
                var result = {};
                namesAndValues.forEach(function (item) {
                    result[item.name] = item.value;
                });
                return result;
            };
        },
        set: function set() {}
    }

}, null);

exports.default = _index2.default;
module.exports = exports['default'];