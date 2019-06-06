'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ParameterExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(name, type, nodeType) {
        ///<param name="name" type="string" />
        ///<field name="name" type="string" />
        //this.writePropertyValue("name", name);
        //this.writePropertyValue("type", type);
        this.nodeType = nodeType || _index2.default.Expressions.ExpressionType.Parameter;
        this.name = name;
        this.type = type || "unknown";
        var _owningFunction;
    },

    owningFunction: { value: undefined, enumerable: false },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Parameter, writable: true },
    name: { value: undefined, dataType: String, writable: true },
    type: { value: undefined, dataType: "object", writable: true },
    toString: function toString(debug) {
        var result;
        result = debug ? this.type + " " : "";
        result = result + this.name;
        return result;
    }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];