'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.GroupExpression', _index2.default.Expressions.EntitySetExpression, null, {
    constructor: function constructor(source, expression) {
        ///<param name="name" type="string" />
        ///<field name="name" type="string" />
        //this.source = source;
        //this.selector = expression;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.GroupBy, enumerable: true },
    toString: function toString(debug) {
        //var result;
        //result = debug ? this.type + " " : "";
        //result = result + this.name;
        var result = "unimplemented";
        return result;
    }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];