'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.oData.oDataProjectionCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(provider) {
        this.provider = provider;
        this.entityContext = provider.context;
        this.hasObjectLiteral = false;
        this.modelBinderMapping = [];
    },

    compile: function compile(expression, context) {
        this.Visit(expression, context);
    },
    VisitProjectionExpression: function VisitProjectionExpression(expression, context) {
        ///<summary></summary>
        ///<param name="expression" type="$data.Expressions.ProjectionExpression" mayBeNull="false"></param>
        ///<param name="context" mayBeNull="false"></param>
        context.data = "";
        this.mapping = [];

        this.Visit(expression.selector, context);
        if (context['$select']) {
            context['$select'] += ',';
        } else {
            context['$select'] = '';
        }
        context["$select"] += context.data;
        context.data = "";
    },
    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, context) {
        this.Visit(expression.expression, context);
        var m = this.mapping.slice();

        if (!(expression.expression instanceof _core2.default.Expressions.EntityExpression) && !(expression.expression instanceof _core2.default.Expressions.EntitySetExpression)) {
            m.pop();
        }

        if (m.length > 0) {
            if (!context['$expand'] || !(context['$expand'] instanceof _core2.default.storageProviders.oData.ODataIncludeFragment)) {
                context['$expand'] = new _core2.default.storageProviders.oData.ODataIncludeFragment();
            }
            context['$expand'].addInclude(m);
        }
    },
    VisitObjectLiteralExpression: function VisitObjectLiteralExpression(expression, context) {
        ///<summary></summary>
        ///<param name="expression" type="$data.Expressions.ObjectLiteralExpression" mayBeNull="false"></param>
        ///<param name="context" mayBeNull="false"></param>

        this.hasObjectLiteral = true;
        expression.members.forEach(function (member, index) {
            this.Visit(member, context);
            if (index < expression.members.length - 1) {
                context.data += ',';
            }
            this.mapping = [];
        }, this);
    },
    VisitObjectFieldExpression: function VisitObjectFieldExpression(expression, context) {
        this.Visit(expression.expression, context);

        var m = this.mapping.slice();
        var propertyName = "";
        if (!(expression.expression instanceof _core2.default.Expressions.EntityExpression) && !(expression.expression instanceof _core2.default.Expressions.EntitySetExpression)) {
            propertyName = m.pop();
        }

        if (m.length > 0) {
            if (!context['$expand'] || !(context['$expand'] instanceof _core2.default.storageProviders.oData.ODataIncludeFragment)) {
                context['$expand'] = new _core2.default.storageProviders.oData.ODataIncludeFragment();
            }

            if (expression.expression instanceof _core2.default.Expressions.EntityFieldExpression && expression.expression.selector instanceof _core2.default.Expressions.MemberInfoExpression) {
                var storageModel = this.entityContext._storageModel.getStorageModel(expression.expression.selector.memberDefinition.definedBy);
                if (!storageModel || storageModel.IsComplexType) return;

                var isComplexProperty = storageModel && !!storageModel.ComplexTypes[expression.memberName];
                if (isComplexProperty) {
                    var complexProperty = m.pop();
                    context['$expand'].addImplicitMap(m, complexProperty);
                    return;
                }
            }

            if (expression.expression instanceof _core2.default.Expressions.ComplexTypeExpression) {
                context['$expand'].addImplicitMap(m, propertyName);
            } else {
                context['$expand'].addInclude(m);
            }
        }
    },

    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, context) {
        this.Visit(expression.source, context);
        this.Visit(expression.selector, context);
    },

    VisitEntityFieldExpression: function VisitEntityFieldExpression(expression, context) {
        this.Visit(expression.source, context);
        this.Visit(expression.selector, context);
    },
    VisitEntityExpression: function VisitEntityExpression(expression, context) {
        ///<summary></summary>
        ///<param name="expression" type="$data.Expressions.EntityExpression" mayBeNull="false"></param>
        ///<param name="context" mayBeNull="false"></param>
        this.Visit(expression.source, context);
    },
    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        ///<summary></summary>
        ///<param name="expression" type="$data.Expressions.EntitySetExpression" mayBeNull="false"></param>
        ///<param name="context" mayBeNull="false"></param>
        if (expression.source instanceof _core2.default.Expressions.EntityExpression) {
            this.Visit(expression.source, context);
        }
        if (expression.selector instanceof _core2.default.Expressions.AssociationInfoExpression) {
            this.Visit(expression.selector, context);
        }
    },
    VisitAssociationInfoExpression: function VisitAssociationInfoExpression(expression, context) {
        var propName = expression.associationInfo.FromPropertyName;
        var sm = this.entityContext._storageModel.getStorageModel(expression.associationInfo.FromType.inheritsFrom);
        if (sm && !sm.IsComplexType) {
            propName = expression.associationInfo.FromType.fullName + "/" + propName;
        }
        this.mapping.push(propName);

        if (context.data && context.data.length > 0 && context.data[context.data.length - 1] != ',') {
            if (!context['$expand'] || !(context['$expand'] instanceof _core2.default.storageProviders.oData.ODataIncludeFragment)) {
                context['$expand'] = new _core2.default.storageProviders.oData.ODataIncludeFragment();
            }
            context['$expand'].addInclude(this.mapping);
        } else {
            context.data += propName;
        }
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, context) {
        var storageModel = this.entityContext._storageModel.getStorageModel(expression.memberDefinition.definedBy);
        var isComplexProperty = storageModel && !storageModel.IsComplexType && !!storageModel.ComplexTypes[expression.memberName];
        var isComplexField = !storageModel || storageModel.IsComplexType;

        var propName = expression.memberName;
        var sm = this.entityContext._storageModel.getStorageModel(expression.memberDefinition.definedBy.inheritsFrom);
        if (sm && !sm.IsComplexType) {
            propName = expression.memberDefinition.definedBy.fullName + "/" + propName;
        }

        if (context.data && context.data.length > 0 && context.data[context.data.length - 1] != ',') {
            if (this.mapping) {
                if (!context['$expand'] || !(context['$expand'] instanceof _core2.default.storageProviders.oData.ODataIncludeFragment)) {
                    context['$expand'] = new _core2.default.storageProviders.oData.ODataIncludeFragment();
                }
                if (isComplexField) {
                    var m = this.mapping.slice();
                    var complexProperty = m.pop();
                    if (this.provider.checkODataMode("disableCompltexTypeMapping")) {
                        context['$expand'].addImplicitMap(m, complexProperty);
                    } else {
                        context['$expand'].addImplicitMap(m, complexProperty + "/" + expression.memberName);
                    }
                } else if (!isComplexProperty) {
                    context['$expand'].addImplicitMap(this.mapping, expression.memberName);
                }
            }
        } else {
            context.data += propName;
        }

        this.mapping.push(propName);
    },
    VisitConstantExpression: function VisitConstantExpression(expression, context) {
        //Guard.raise(new Exception('Constant value is not supported in Projection.', 'Not supported!'));
        //context.data += expression.value;
        context.data = context.data.slice(0, context.data.length - 1);
    },
    VisitEntityFieldOperationExpression: function VisitEntityFieldOperationExpression(expression, context) {
        _core.Guard.requireType("expression.operation", expression.operation, _core2.default.Expressions.MemberInfoExpression);

        var opDef = expression.operation.memberDefinition;
        if (opDef.aggregate) {
            var opName = opDef.mapTo || opDef.name;
            context.aggregate = context.aggregate || [];

            var temp = context.data;
            this.Visit(expression.source, context);
            var field = context.data.replace(temp, "");
            context.data = temp.replace(/,$/, "");
            context.aggregate.push(field + ' with ' + opName + ' as ' + field);
        } else this.Visit(expression.source, context);
    }
});