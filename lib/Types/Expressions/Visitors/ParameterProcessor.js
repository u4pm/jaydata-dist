"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../../../TypeSystem/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)("$data.Expressions.ParameterProcessor", _index2.default.Expressions.ExpressionVisitor, null, {
    constructor: function constructor() {
        ///<summary>Provides a base class for several ParameterProcessors like GlobalParameterProcessor or LambdaParameterProcessor</summary>
    },

    Visit: function Visit(node, context) {
        if ((node instanceof _index2.default.Expressions.ParameterExpression || node instanceof _index2.default.Expressions.ThisExpression) && this.canResolve(node)) {
            var result = this.resolve(node, context);
            if (result !== node) result["resolvedBy"] = this.constructor.name;
            return result;
        } else {
            return node;
        }
    },

    canResolve: function canResolve(paramExpression) {
        ///<returns type="boolean" />
        _index.Guard.raise("Pure method");
    },
    resolve: function resolve(paramExpression) {
        ///<returns type="XXX" />
        _index.Guard.raise("Pure method");
    }
});

exports.default = _index2.default;
module.exports = exports['default'];