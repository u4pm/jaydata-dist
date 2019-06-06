'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.FunctionExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(name, parameters, body) {
        ///<signature>
        ///<summary>Represents a function declaration.</summary>
        ///<param name="name" type="String">Function name</param>
        ///<param name="parameters" type="Array" elementType="$data.Expressions.ParameterExpression">The list of function parameters</param>
        ///<param name="body" type="$data.Expressions.ExpressionNode" />
        ///</signature>
        ///<field name="parameters" type="Array" elementType="$data.Expressions.ParameterExpression">The list of function parameters</field>
        ///<field name="body" type="$data.Expressions.ExpressionNode">The function body</field>

        this.parameters = parameters || [];
        this.name = name;
        this.body = body;
    },

    toString: function toString(debug) {
        var paramStrings = this.parameters.map(function (p) {
            return p.toString();
        });
        paramStrings = paramStrings.join(",");
        var bodyString = this.body ? this.body.toString(debug) : '';
        return "function " + this.name + "(" + paramStrings + ") { " + bodyString + "}";
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Function, writable: true },
    parameters: { value: undefined, dataType: Array, elementType: _index2.default.Expressions.ParameterExpression },
    body: { value: undefined, dataType: _index2.default.Expressions.ExpressionNode },
    type: {}
}, null);

exports.default = _index2.default;
module.exports = exports['default'];