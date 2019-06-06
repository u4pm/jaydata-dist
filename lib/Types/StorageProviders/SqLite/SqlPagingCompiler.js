'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

var _SqLiteCompiler = require('./SqLiteCompiler.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.sqLite.SqlPagingCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(provider) {
        this.provider = provider;
    },
    compile: function compile(expression, context) {
        this.Visit(expression, context);
    },
    VisitPagingExpression: function VisitPagingExpression(expression, sqlBuilder) {
        this.Visit(expression.amount, sqlBuilder);
    },
    VisitConstantExpression: function VisitConstantExpression(expression, sqlBuilder) {
        sqlBuilder.addParameter(expression.value);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.parameter);
    }
});