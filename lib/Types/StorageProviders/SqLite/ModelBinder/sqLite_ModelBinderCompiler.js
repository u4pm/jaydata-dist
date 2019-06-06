'use strict';

var _core = require('../../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.sqLite.sqLite_ModelBinderCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(query, context) {
        this._query = query;
        this.sqlContext = context;
        this._sqlBuilder = _core2.default.sqLite.SqlBuilder.create(context.sets, context.entityContext);
    },
    VisitSingleExpression: function VisitSingleExpression(expression) {
        this._defaultModelBinder(expression);
    },
    VisitSomeExpression: function VisitSomeExpression(expression) {
        this._defaultModelBinder(expression);
    },
    VisitFindExpression: function VisitFindExpression(expression) {
        this._defaultModelBinder(expression);
    },
    VisitEveryExpression: function VisitEveryExpression(expression) {
        this._defaultModelBinder(expression);
    },
    VisitToArrayExpression: function VisitToArrayExpression(expression) {
        this._defaultModelBinder(expression);
    },
    VisitFirstExpression: function VisitFirstExpression(expression) {
        this._defaultModelBinder(expression);
    },
    VisitForEachExpression: function VisitForEachExpression(expression) {
        this._defaultModelBinder(expression);
    },
    VisitCountExpression: function VisitCountExpression(expression) {
        var builder = _core.Container.createqueryBuilder();

        builder.modelBinderConfig['$type'] = _core2.default.Array;
        builder.selectModelBinderProperty('$item');
        builder.modelBinderConfig['$type'] = _core2.default.Integer;
        builder.modelBinderConfig['$source'] = 'cnt';
        builder.resetModelBinderProperty();
        this._query.modelBinderConfig = builder.modelBinderConfig;
    },

    VisitExpression: function VisitExpression(expression, builder) {
        var projVisitor = _core.Container.createFindProjectionVisitor();
        projVisitor.Visit(expression);

        if (projVisitor.projectionExpression) {
            this.Visit(projVisitor.projectionExpression, builder);
        } else {
            this.DefaultSelection(builder);
        }
    },
    _defaultModelBinder: function _defaultModelBinder(expression) {
        var builder = _core.Container.createqueryBuilder();
        builder.modelBinderConfig['$type'] = _core2.default.Array;
        builder.modelBinderConfig['$item'] = {};
        builder.selectModelBinderProperty('$item');

        this.VisitExpression(expression, builder);

        builder.resetModelBinderProperty();
        this._query.modelBinderConfig = builder.modelBinderConfig;
    },
    _addPropertyToModelBinderConfig: function _addPropertyToModelBinderConfig(elementType, builder) {
        var storageModel = this._query.context._storageModel.getStorageModel(elementType);
        elementType.memberDefinitions.getPublicMappedProperties().forEach(function (prop) {
            if (!storageModel || storageModel && !storageModel.Associations[prop.name] && !storageModel.ComplexTypes[prop.name]) {
                if (prop.key) {
                    if (this.currentObjectFieldName) {
                        builder.addKeyField(this.currentObjectFieldName + '__' + prop.name);
                    } else {
                        builder.addKeyField(prop.name);
                    }
                }
                if (this.currentObjectFieldName) {
                    builder.modelBinderConfig[prop.name] = this.currentObjectFieldName + '__' + prop.name;
                } else {
                    builder.modelBinderConfig[prop.name] = prop.name;
                }
            }
        }, this);
        if (storageModel) {
            this._addComplexTypeProperties(storageModel.ComplexTypes, builder);
        }
    },
    _addComplexTypeProperties: function _addComplexTypeProperties(complexTypes, builder) {
        complexTypes.forEach(function (ct) {

            builder.selectModelBinderProperty(ct.FromPropertyName);
            builder.modelBinderConfig['$type'] = ct.ToType;
            var tmpPrefix = this.currentObjectFieldName;
            if (this.currentObjectFieldName) {
                this.currentObjectFieldName += '__';
            } else {
                this.currentObjectFieldName = '';
            }
            this.currentObjectFieldName += ct.FromPropertyName;
            //recursion
            this._addPropertyToModelBinderConfig(ct.ToType, builder);
            //reset model binder property
            builder.popModelBinderProperty();
            this.currentObjectFieldName = tmpPrefix;
        }, this);
    },
    DefaultSelection: function DefaultSelection(builder) {
        //no projection, get all item from entitySet
        builder.modelBinderConfig['$type'] = this._query.defaultType;
        var storageModel = this._query.context._storageModel.getStorageModel(this._query.defaultType);

        var needPrefix = this.sqlContext.infos.filter(function (i) {
            return i.IsMapped;
        }).length > 1;
        if (needPrefix) {
            this.currentObjectFieldName = this._sqlBuilder.getExpressionAlias(this.sqlContext.sets[0]);
        }
        this._addPropertyToModelBinderConfig(this._query.defaultType, builder);
        this.sqlContext.infos.forEach(function (info, infoIndex) {
            if (infoIndex > 0 && info.IsMapped) {
                var pathFragments = info.NavigationPath.split('.');
                pathFragments.shift();
                var popCnt = 0;
                pathFragments.forEach(function (pathFragment, index) {
                    if (!pathFragment) {
                        return;
                    }
                    if (!builder.modelBinderConfig[pathFragment]) {
                        builder.selectModelBinderProperty(pathFragment);
                        if (info.Association.associationInfo.ToMultiplicity === '*' && pathFragments.length - 1 === index) {
                            builder.modelBinderConfig['$type'] = _core2.default.Array;
                            builder.selectModelBinderProperty('$item');
                            popCnt++;
                        }

                        builder.modelBinderConfig['$type'] = this.sqlContext.sets[infoIndex].elementType;
                        this.currentObjectFieldName = this._sqlBuilder.getExpressionAlias(this.sqlContext.sets[infoIndex]);
                        this._addPropertyToModelBinderConfig(this.sqlContext.sets[infoIndex].elementType, builder);
                        while (popCnt--) {
                            builder.popModelBinderProperty();
                        }
                    } else {
                        builder.selectModelBinderProperty(pathFragment);
                        if (builder.modelBinderConfig.$type == _core2.default.Array) {
                            builder.selectModelBinderProperty("$item");
                            popCnt++;
                        }
                    }
                }, this);
                for (var i = 0; i < pathFragments.length; i++) {
                    builder.popModelBinderProperty();
                }
            }
        }, this);
    },
    VisitProjectionExpression: function VisitProjectionExpression(expression, builder) {
        this.hasProjection = true;
        this.Visit(expression.selector, builder);

        if (expression.selector && expression.selector.expression instanceof _core2.default.Expressions.ObjectLiteralExpression) {
            builder.modelBinderConfig['$type'] = expression.projectionAs || builder.modelBinderConfig['$type'] || _core2.default.Object;
        }
    },
    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, builder) {
        if (expression.expression instanceof _core2.default.Expressions.EntityExpression) {
            this.VisitEntityAsProjection(expression.expression, builder);
            builder.modelBinderConfig['$keys'].unshift('rowid$$');
        } else if (expression.expression instanceof _core2.default.Expressions.EntitySetExpression) {
            this.currentObjectFieldName = this._sqlBuilder.getExpressionAlias(expression.expression);
            this.VisitEntitySetAsProjection(expression.expression, builder);
            builder.modelBinderConfig['$keys'] = ['rowid$$'];
        } else if (expression.expression instanceof _core2.default.Expressions.ComplexTypeExpression) {
            this.VisitEntityAsProjection(expression.expression, builder);
        } else {
            builder.modelBinderConfig['$keys'] = ['rowid$$'];
            this.Visit(expression.expression, builder);
            if (expression.expression instanceof _core2.default.Expressions.EntityFieldExpression) {
                builder.modelBinderConfig['$source'] = 'd';
            }
        }
    },
    VisitConstantExpression: function VisitConstantExpression(expression, builder) {
        builder.modelBinderConfig['$type'] = expression.type;
        builder.modelBinderConfig['$source'] = this.currentObjectFieldName;
    },
    VisitEntityAsProjection: function VisitEntityAsProjection(expression, builder) {
        this.Visit(expression.source, builder);
        builder.modelBinderConfig['$type'] = expression.entityType;
        this._addPropertyToModelBinderConfig(expression.entityType, builder);
    },
    VisitEntitySetAsProjection: function VisitEntitySetAsProjection(expression, builder) {
        builder.modelBinderConfig['$type'] = _core2.default.Array;
        builder.selectModelBinderProperty('$item');
        builder.modelBinderConfig['$type'] = expression.elementType;
        this._addPropertyToModelBinderConfig(expression.elementType, builder);
        builder.popModelBinderProperty();
    },
    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, builder) {
        return expression;
    },
    VisitEntityFieldExpression: function VisitEntityFieldExpression(expression, builder) {
        this.Visit(expression.source, builder);
        this.Visit(expression.selector, builder);
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, builder) {
        if (expression.memberDefinition instanceof _core2.default.MemberDefinition) {
            builder.modelBinderConfig['$type'] = expression.memberDefinition.type;
            if (expression.memberDefinition.storageModel && expression.memberName in expression.memberDefinition.storageModel.ComplexTypes) {
                this._addPropertyToModelBinderConfig(_core.Container.resolveType(expression.memberDefinition.type), builder);
            } else {
                builder.modelBinderConfig['$source'] = this.currentObjectFieldName;
            }
        }
    },
    VisitEntitySetExpression: function VisitEntitySetExpression(expression, builder) {
        if (expression.source instanceof _core2.default.Expressions.EntityExpression) {
            this.Visit(expression.source, builder);
            this.Visit(expression.selector, builder);
        }
    },
    VisitEntityExpression: function VisitEntityExpression(expression, builder) {
        this.Visit(expression.source, builder);
    },
    VisitAssociationInfoExpression: function VisitAssociationInfoExpression(expression, builder) {
        if ('$selector' in builder.modelBinderConfig && builder.modelBinderConfig.$selector.length > 0) {
            builder.modelBinderConfig.$selector += '.';
        } else {
            builder.modelBinderConfig['$selector'] = 'json:';
        }
        builder.modelBinderConfig['$selector'] += expression.associationInfo.FromPropertyName;
    },
    VisitSimpleBinaryExpression: function VisitSimpleBinaryExpression(expression, builder) {
        this.Visit(expression.left, builder);
        this.Visit(expression.right, builder);
        builder.modelBinderConfig['$type'] = undefined;
    },
    VisitObjectLiteralExpression: function VisitObjectLiteralExpression(expression, builder) {
        builder.modelBinderConfig['$type'] = _core2.default.Object;
        expression.members.forEach(function (of) {
            this.Visit(of, builder);
        }, this);
    },
    VisitObjectFieldExpression: function VisitObjectFieldExpression(expression, builder) {
        var tempFieldName = this.currentObjectFieldName;
        builder.selectModelBinderProperty(expression.fieldName);
        if (this.currentObjectFieldName) {
            this.currentObjectFieldName += '__';
        } else {
            this.currentObjectFieldName = '';
        }
        this.currentObjectFieldName += expression.fieldName;

        if (expression.expression instanceof _core2.default.Expressions.EntityExpression || expression.expression instanceof _core2.default.Expressions.ComplexTypeExpression) {
            this.VisitEntityAsProjection(expression.expression, builder);
        } else if (expression.expression instanceof _core2.default.Expressions.EntitySetExpression) {
            this.VisitEntitySetAsProjection(expression.expression, builder);
        } else {
            this.Visit(expression.expression, builder);
        }

        this.currentObjectFieldName = tempFieldName;

        builder.popModelBinderProperty();
    }
});