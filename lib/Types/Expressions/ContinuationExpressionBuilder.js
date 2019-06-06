'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ContinuationExpressionBuilder', _index2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(mode) {
        this.mode = mode;
    },
    compile: function compile(query) {

        var findContext = { mode: "find", skipExists: false };
        this.Visit(query.expression, findContext);

        var result = {
            skip: findContext.skipSize,
            take: findContext.pageSize,
            message: ''
        };

        if ('pageSize' in findContext) {
            var expression;
            var context = { mode: this.mode, pageSize: findContext.pageSize };

            if (!findContext.skipExists && findContext.pageSize) {
                context.append = true;
                expression = this.Visit(query.expression, context);
            } else if (findContext.skipExists) {
                expression = this.Visit(query.expression, context);
            }

            if (!context.abort) {
                result.expression = expression;
            } else {
                result.skip = (result.skip || 0) - result.take;
                result.message = 'Invalid skip value!';
            }
        } else {
            result.message = 'take expression not defined in the chain!';
        }

        return result;
    },
    VisitPagingExpression: function VisitPagingExpression(expression, context) {

        switch (context.mode) {
            case 'find':
                if (expression.nodeType === _index2.default.Expressions.ExpressionType.Take) {
                    context.pageSize = expression.amount.value;
                } else {
                    context.skipSize = expression.amount.value;
                    context.skipExists = true;
                }
                break;
            case 'prev':
                if (expression.nodeType === _index2.default.Expressions.ExpressionType.Skip) {
                    var amount = expression.amount.value - context.pageSize;
                    context.abort = amount < 0 && expression.amount.value >= context.pageSize;

                    var constExp = _index.Container.createConstantExpression(Math.max(amount, 0), "number");
                    return _index.Container.createPagingExpression(expression.source, constExp, expression.nodeType);
                } else if (context.append) {
                    //no skip expression, skip: 0, no prev
                    context.abort = true;
                }
                break;
            case 'next':
                if (expression.nodeType === _index2.default.Expressions.ExpressionType.Skip) {
                    var amount = context.pageSize + expression.amount.value;
                    var constExp = _index.Container.createConstantExpression(amount, "number");
                    return _index.Container.createPagingExpression(expression.source, constExp, expression.nodeType);
                } else if (context.append) {
                    //no skip expression, skip: 0
                    var constExp = _index.Container.createConstantExpression(context.pageSize, "number");
                    return _index.Container.createPagingExpression(expression, constExp, _index2.default.Expressions.ExpressionType.Skip);
                }
                break;
            default:
        }

        this.Visit(expression.source, context);
    }
});

exports.default = _index2.default;
module.exports = exports['default'];