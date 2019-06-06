'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.mongoDB.mongoDBProjectionCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(provider, lambdaPrefix, compiler) {
        this.provider = provider;
        this.lambdaPrefix = lambdaPrefix;
        if (compiler) {
            this.compiler = compiler;
            this.includes = compiler.includes;
            this.mainEntitySet = compiler.mainEntitySet;
        }
    },

    compile: function compile(expression, context) {
        this.Visit(expression, context);
        delete context.current;
        delete context.complexType;
    },
    VisitProjectionExpression: function VisitProjectionExpression(expression, context) {
        this.Visit(expression.selector, context);
    },
    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, context) {
        this.Visit(expression.expression, context);
    },
    VisitObjectLiteralExpression: function VisitObjectLiteralExpression(expression, context) {
        var tempObjectLiteralPath = this.ObjectLiteralPath;
        this.hasObjectLiteral = true;
        expression.members.forEach(function (member, index) {
            this.Visit(member, context);
        }, this);
    },
    VisitObjectFieldExpression: function VisitObjectFieldExpression(expression, context) {
        this.Visit(expression.expression, context);
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
        if (context.includeOptions && !context.includeOptions.fields) {
            context.include.full = true;
        }
        delete context.include;
        delete context.includeOptions;
        this.Visit(expression.source, context);
    },
    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        if (expression.source instanceof _core2.default.Expressions.EntityExpression) {
            this.Visit(expression.source, context);
        }
        if (expression.selector instanceof _core2.default.Expressions.AssociationInfoExpression) {
            this.Visit(expression.selector, context);
        }
    },
    VisitAssociationInfoExpression: function VisitAssociationInfoExpression(expression, context) {
        this.includes = this.includes || [];
        var from = context.include ? context.include.name + '.' + expression.associationInfo.FromPropertyName : expression.associationInfo.FromPropertyName;
        var includeFragment = from.split('.');
        var tempData = null;
        var storageModel = this.mainEntitySet.entityContext._storageModel.getStorageModel(this.mainEntitySet.createNew);
        for (var i = 0; i < includeFragment.length; i++) {
            if (tempData) {
                tempData += '.' + includeFragment[i];
            } else {
                tempData = includeFragment[i];
            }
            var association = storageModel.Associations[includeFragment[i]];
            if (association) {
                var inc = this.includes.filter(function (include) {
                    return include.name == tempData;
                }, this);
                if (context.include && i < includeFragment.length - 1) {
                    if (!context.include.options.fields) context.include.options.fields = { _id: 1 };
                    context.include.options.fields[includeFragment[i + 1]] = 1;
                }
                if (inc.length) {
                    context.includeOptions = inc[0].options;
                    context.include = inc[0];
                    inc[0].mapped = true;
                } else {
                    var inc = { name: tempData, type: association.ToType, from: association.FromType, query: {}, options: {}, mapped: true };
                    context.includeOptions = inc.options;
                    context.include = inc;
                    context.include.options.fields = { _id: 1 };
                    context.include.options.fields[association.ToPropertyName] = 1;
                    this.includes.push(inc);
                }
                if (!context.options.fields) context.options.fields = { _id: 1 };
                context.options.fields[includeFragment[0]] = 1;
                association.ReferentialConstraint.forEach(function (ref) {
                    for (var p in ref) {
                        context.options.fields[ref[p]] = 1;
                    }
                });
            } else {
                _core.Guard.raise(new _core.Exception("The given include path is invalid: " + expression.associationInfo.FromPropertyName + ", invalid point: " + tempData));
            }
            storageModel = this.mainEntitySet.entityContext._storageModel.getStorageModel(association.ToType);
        }
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, context) {
        if (!(context.includeOptions || context.options).fields) (context.includeOptions || context.options).fields = { _id: 1 };
        context.current = expression.memberName;
        if (context.complexType) {
            delete (context.includeOptions || context.options).fields[context.complexType];
            (context.includeOptions || context.options).fields[context.complexType + '.' + context.current] = 1;
            delete context.complexType;
        } else {
            if (!(context.includeOptions || context.options).fields[expression.memberName]) (context.includeOptions || context.options).fields[expression.memberName] = 1;
        }
        delete context.includeOptions;
        delete context.include;
    },
    VisitConstantExpression: function VisitConstantExpression(expression, context) {}
});