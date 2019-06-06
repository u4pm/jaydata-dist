'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.mongoDB.mongoDBPagingCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(provider) {
        this.provider = provider;
    },

    compile: function compile(expression, context) {
        this.Visit(expression, context);
    },
    VisitPagingExpression: function VisitPagingExpression(expression, context) {
        var pagingContext = { data: 0 };
        this.Visit(expression.amount, pagingContext);
        switch (expression.nodeType) {
            case _core2.default.Expressions.ExpressionType.Skip:
                context.options.skip = pagingContext.data;break;
            case _core2.default.Expressions.ExpressionType.Take:
                context.options.limit = pagingContext.data;break;
            default:
                _core.Guard.raise("Not supported nodeType");break;
        }
    },
    VisitConstantExpression: function VisitConstantExpression(expression, context) {
        context.data += expression.value;
    }
});