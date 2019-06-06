'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.QueryExpressionCreator', _index2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(scopeContext) {
        ///<param name="scopeContext" type="$data.Expressions.EntityContext" />
        _index.Guard.requireValue("scopeContext", scopeContext);
        this.scopeContext = scopeContext;
    },
    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        if (expression.source instanceof _index2.default.Expressions.EntityContextExpression) {
            this.lambdaTypes.push(expression);
        }
        return expression;
    },

    VisitServiceOperationExpression: function VisitServiceOperationExpression(expression, context) {
        if (expression.source instanceof _index2.default.Expressions.EntityContextExpression) {
            this.lambdaTypes.push(expression);
        }
        return expression;
    },

    VisitCodeExpression: function VisitCodeExpression(expression, context) {
        ///<summary>Converts the CodeExpression into an EntityExpression</summary>
        ///<param name="expression" type="$data.Expressions.CodeExpression" />
        var source = expression.source.toString();
        var jsCodeTree = _index.Container.createCodeParser(this.scopeContext).createExpression(source);
        this.scopeContext.log({ event: "JSCodeExpression", data: jsCodeTree });

        //TODO rename classes to reflex variable names
        //TODO engage localValueResolver here
        //var globalVariableResolver = Container.createGlobalContextProcessor($data.__global);
        var constantResolver = _index.Container.createConstantValueResolver(expression.parameters, _index2.default.__global, this.scopeContext);
        var parameterProcessor = _index.Container.createParameterResolverVisitor();

        jsCodeTree = parameterProcessor.Visit(jsCodeTree, constantResolver);

        this.scopeContext.log({ event: "JSCodeExpressionResolved", data: jsCodeTree });
        var code2entity = _index.Container.createCodeToEntityConverter(this.scopeContext);

        ///user provided query parameter object (specified as thisArg earlier) is passed in
        var entityExpression = code2entity.Visit(jsCodeTree, { queryParameters: expression.parameters, lambdaParameters: this.lambdaTypes, frameType: context.frameType });

        ///parameters are referenced, ordered and named, also collected in a flat list of name value pairs
        var result = _index.Container.createParametricQueryExpression(entityExpression, code2entity.parameters);
        this.scopeContext.log({ event: "EntityExpression", data: entityExpression });

        return result;
    },

    VisitFilterExpression: function VisitFilterExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        context = context || {};
        context.frameType = expression.getType();
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createFilterExpression(source, selector, expression.params, expression.instance);
        }
        return expression;
    },

    VisitInlineCountExpression: function VisitInlineCountExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        context = context || {};
        context.frameType = expression.getType();
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createInlineCountExpression(source, selector, expression.params, expression.instance);
        }
        return expression;
    },

    VisitProjectionExpression: function VisitProjectionExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        context = context || {};
        context.frameType = expression.getType();
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            var expr = _index.Container.createProjectionExpression(source, selector, expression.params, expression.instance);
            expr.projectionAs = expression.projectionAs;
            return expr;
        }
        return expression;
    },

    VisitOrderExpression: function VisitOrderExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        context = context || {};
        context.frameType = expression.getType();
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createOrderExpression(source, selector, expression.nodeType);
        }
        return expression;
    },

    VisitIncludeExpression: function VisitIncludeExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        context = context || {};
        context.frameType = expression.getType();
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createIncludeExpression(source, selector);
        }
        return expression;
    },

    VisitGroupExpression: function VisitGroupExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        context = context || {};
        context.frameType = expression.getType();
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createGroupExpression(source, selector);
        }
        return expression;
    }
});

exports.default = _index2.default;
module.exports = exports['default'];