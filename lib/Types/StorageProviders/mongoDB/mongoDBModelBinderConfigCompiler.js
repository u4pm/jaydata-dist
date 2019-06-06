'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.modelBinder.mongoDBModelBinderConfigCompiler', _core2.default.modelBinder.ModelBinderConfigCompiler, null, {
    _addPropertyToModelBinderConfig: function _addPropertyToModelBinderConfig(elementType, builder) {
        var storageModel = this._query.context._storageModel.getStorageModel(elementType);
        if (elementType.memberDefinitions) {
            elementType.memberDefinitions.getPublicMappedProperties().forEach(function (prop) {
                if (!storageModel || storageModel && !storageModel.Associations[prop.name] && !storageModel.ComplexTypes[prop.name]) {

                    if (!storageModel && this._query.context.storageProvider.supportedDataTypes.indexOf(_core.Container.resolveType(prop.dataType)) < 0) {
                        builder.selectModelBinderProperty(prop.name);
                        builder.modelBinderConfig['$type'] = _core.Container.resolveType(prop.dataType);

                        if (this._isoDataProvider) {
                            builder.modelBinderConfig['$selector'] = ['json:' + prop.name + '.results', 'json:' + prop.name];
                        } else {
                            builder.modelBinderConfig['$selector'] = 'json:' + prop.name;
                        }
                        this._addPropertyToModelBinderConfig(_core.Container.resolveType(prop.dataType), builder);
                        builder.popModelBinderProperty();
                    } else {
                        if (prop.key) {
                            builder.addKeyField(prop.computed ? '_id' : prop.name);
                        }
                        if (prop.concurrencyMode === _core2.default.ConcurrencyMode.Fixed) {
                            builder.modelBinderConfig[prop.name] = { $selector: 'json:__metadata', $source: 'etag' };
                        } else {
                            var dt = _core.Container.resolveType(prop.dataType);
                            if (dt === _core2.default.Array || dt === _core2.default.Object) {
                                builder.modelBinderConfig[prop.name] = {
                                    $type: dt,
                                    $source: prop.name
                                };
                            } else builder.modelBinderConfig[prop.name] = prop.computed ? '_id' : prop.name;
                        }
                    }
                }
            }, this);
        } else {
            builder._binderConfig.$item = builder._binderConfig.$item || {};
            builder.modelBinderConfig = builder._binderConfig.$item;
        }
        if (storageModel) {
            this._addComplexTypeProperties(storageModel.ComplexTypes, builder);
        }
    },
    _addComplexType: function _addComplexType(ct, builder) {
        if (ct.ToType !== _core2.default.Array) {
            builder.modelBinderConfig['$type'] = ct.ToType;
            if (this._isoDataProvider) {
                builder.modelBinderConfig['$selector'] = ['json:' + ct.FromPropertyName + '.results', 'json:' + ct.FromPropertyName];
            } else {
                builder.modelBinderConfig['$selector'] = 'json:' + ct.FromPropertyName;
            }
            this._addPropertyToModelBinderConfig(ct.ToType, builder);
        } else {
            var dt = ct.ToType;
            var et = _core.Container.resolveType(ct.FromType.memberDefinitions.getMember(ct.FromPropertyName).elementType);
            if (dt === _core2.default.Array && et && et.isAssignableTo && et.isAssignableTo(_core2.default.Entity)) {
                var config = {
                    $type: _core2.default.Array,
                    $selector: 'json:' + ct.FromPropertyName,
                    $item: {
                        $type: et
                    }
                };
                var md = et.memberDefinitions.getPublicMappedProperties();
                for (var i = 0; i < md.length; i++) {
                    config.$item[md[i].name] = { $type: md[i].type, $source: md[i].name };
                }
                _core2.default.typeSystem.extend(builder.modelBinderConfig, config);
            } else {
                if (dt === _core2.default.Array && et === _core2.default.ObjectID) {
                    _core2.default.typeSystem.extend(builder.modelBinderConfig, {
                        $type: _core2.default.Array,
                        $selector: 'json:' + ct.FromPropertyName,
                        $item: {
                            $type: _core2.default.ObjectID,
                            $value: function $value(meta, data) {
                                return data;
                            }
                        }
                    });
                } else {
                    _core2.default.typeSystem.extend(builder.modelBinderConfig, {
                        $type: ct.ToType,
                        $source: ct.FromPropertyName
                    });
                }
            }
        }
    },
    _addComplexTypeProperties: function _addComplexTypeProperties(complexTypes, builder) {
        var self = this;
        complexTypes.forEach(function (ct) {
            builder.selectModelBinderProperty(ct.FromPropertyName);
            self._addComplexType(ct, builder);
            builder.popModelBinderProperty();
        }, this);
    },
    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, builder) {
        this.Visit(expression.source, builder);
        this.Visit(expression.selector, builder);

        if ('$selector' in builder.modelBinderConfig && builder.modelBinderConfig.$selector.length > 0) {
            if (builder.modelBinderConfig.$selector instanceof _core2.default.Array) {
                var temp = builder.modelBinderConfig.$selector[1];
                builder.modelBinderConfig.$selector[0] = temp + '.' + expression.selector.memberName + '.results';
                builder.modelBinderConfig.$selector[1] = temp + '.' + expression.selector.memberName;
            } else {
                var type = _core.Container.resolveType(expression.selector.memberDefinition.type);
                var elementType = type === _core2.default.Array && expression.selector.memberDefinition.elementType ? _core.Container.resolveType(expression.selector.memberDefinition.elementType) : type;
                if (elementType.memberDefinitions.getMember(expression.selector.memberName)) builder.modelBinderConfig.$selector += '.' + expression.selector.memberName;
            }
        } else {
            var type = _core.Container.resolveType(expression.selector.memberDefinition.type);
            var elementType = type === _core2.default.Array && expression.selector.memberDefinition.elementType ? _core.Container.resolveType(expression.selector.memberDefinition.elementType) : undefined;
            if (type === _core2.default.Array && elementType && elementType.isAssignableTo && elementType.isAssignableTo(_core2.default.Entity)) {
                this._addComplexType(expression.selector.memberDefinition.storageModel.ComplexTypes[expression.selector.memberDefinition.name], builder);
            } else {
                builder.modelBinderConfig.$source = expression.selector.memberName;

                if (type !== _core2.default.Array) {
                    builder.modelBinderConfig.$selector = 'json:' + expression.selector.memberDefinition.name;
                }

                if (builder._binderConfig.$item === builder.modelBinderConfig && expression.selector.memberDefinition.storageModel && expression.selector.memberDefinition.storageModel.ComplexTypes[expression.selector.memberDefinition.name]) {
                    builder.modelBinderConfig.$selectorMemberInfo = builder.modelBinderConfig.$selector;
                    delete builder.modelBinderConfig.$selector;
                } else {
                    delete builder.modelBinderConfig.$source;
                }
            }
        }
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, builder) {
        var type = _core.Container.resolveType(expression.memberDefinition.type);
        var elementType = type === _core2.default.Array && expression.memberDefinition.elementType ? _core.Container.resolveType(expression.memberDefinition.elementType) : undefined;
        builder.modelBinderConfig['$type'] = type;

        if (type === _core2.default.Array && elementType && elementType.isAssignableTo && elementType.isAssignableTo(_core2.default.Entity)) {
            this._addComplexType(expression.memberDefinition.storageModel.ComplexTypes[expression.memberName], builder);
        } else {
            if (expression.memberDefinition.storageModel && expression.memberName in expression.memberDefinition.storageModel.ComplexTypes) {
                this._addPropertyToModelBinderConfig(_core.Container.resolveType(expression.memberDefinition.type), builder);
            } else {
                if (builder._binderConfig.$item === builder.modelBinderConfig) {
                    builder._binderConfig.$item = {
                        $type: builder.modelBinderConfig.$type,
                        $selector: builder.modelBinderConfig.$selectorMemberInfo || builder.modelBinderConfig.$selector,
                        $source: expression.memberDefinition.computed ? '_id' : expression.memberName
                    };
                } else {
                    builder.modelBinderConfig['$source'] = expression.memberDefinition.computed ? '_id' : expression.memberName;
                }
            }
        }
    }
});