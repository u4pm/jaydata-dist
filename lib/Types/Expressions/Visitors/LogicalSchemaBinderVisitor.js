'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//"use strict"; // suspicious code

(0, _index.$C)('$data.Expressions.LogicalSchemaBinderVisitor', _index2.default.Expressions.ExpressionVisitor, null, {
    constructor: function constructor(expression, binder) {},

    VisitProperty: function VisitProperty(expression, context) {
        ///<param name="expression" type="$data.Expressions.ExpressionNode" />
        var exp = this.Visit(expression.expression, context);
        var mem = this.Visit(expression.member, context);

        var type = exp.type;
        var memberType = context.memberResolver.resolve(type, mem.value);
        mem.type = memberType;
        return _index.Container.createPropertyExpression(exp, mem);
    }

}, {});

exports.default = _index2.default;
module.exports = exports['default'];