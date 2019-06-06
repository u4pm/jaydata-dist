'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ODataIncludeFragment = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ODataIncludeFragment = exports.ODataIncludeFragment = function () {
    function ODataIncludeFragment(name) {
        _classCallCheck(this, ODataIncludeFragment);

        this.name = name;
        this.$expand = [];
        this.$operators = [];
    }

    _createClass(ODataIncludeFragment, [{
        key: 'toString',
        value: function toString() {
            var data = '';
            if (this.$expand.length) {
                if (this.name) {
                    data += this.name + '($expand=';
                }
                for (var i = 0; i < this.$expand.length; i++) {
                    if (i !== 0) data += ',';
                    data += this[this.$expand[i]].toString();
                }
                if (this.name) {
                    data += ')';
                }
            }

            if (this.name) {
                for (var _i = 0; _i < this.$operators.length; _i++) {
                    var operator = this.$operators[_i];
                    var values = this[operator];
                    for (var j = 0; j < values.length; j++) {
                        if (data) data += ',';
                        data += this.name + '(' + operator + '=';
                        data += values[j];
                        data += ')';
                    }
                }
            }

            if (this.name && !data) {
                data = this.name;
            }

            return data;
        }
    }, {
        key: 'addInclude',
        value: function addInclude(path, map) {
            this._createIncludePath(path);
        }
    }, {
        key: 'addImplicitMap',
        value: function addImplicitMap(path, map) {
            var includedFragment = this._createIncludePath(path);
            this._setImplicitMap(includedFragment, map);
        }
    }, {
        key: '_createIncludePath',
        value: function _createIncludePath(path) {
            if (!path) return this;
            var inc = path;

            var current = this;
            for (var i = 0; i < inc.length; i++) {
                var it = inc[i];
                var included = true;
                if (current.$expand.indexOf(it) < 0) {
                    included = false;
                    current.$expand.push(it);
                    current[it] = new ODataIncludeFragment(it);
                    current[it].__implicit = true;
                }

                current = current[it];
                if (i < inc.length - 1 && current.__implicit) {
                    this._setImplicitMap(current, inc[i + 1]);
                }
            }

            return current;
        }
    }, {
        key: '_setImplicitMap',
        value: function _setImplicitMap(includeFragment, map) {
            if (map) {
                if (includeFragment.$operators.indexOf('$select') < 0) {
                    if (includeFragment.__implicit) {
                        includeFragment.$operators.push('$select');
                        includeFragment.$select = [map];
                    }
                } else if (includeFragment.$expand.indexOf(map) < 0) {
                    includeFragment.$select[0] += ',' + map;
                }
            }
        }
    }]);

    return ODataIncludeFragment;
}();

_core2.default.storageProviders.oData.ODataIncludeFragment = ODataIncludeFragment;

(0, _core.$C)('$data.storageProviders.oData.oDataIncludeCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(provider) {
        this.provider = provider;
        this.entityContext = provider.context;
    },

    compile: function compile(expression, context) {
        context.data = context.data || new ODataIncludeFragment();
        context.current = context.data;
        this.Visit(expression, context);
    },
    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, context) {
        this.Visit(expression.expression, context);
    },

    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        this.Visit(expression.source, context);
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

        this.includePath = this.includePath ? this.includePath + '.' : "";
        this.includePath += propName;

        var currentPath = this.includePath;
        if (!context.includes.some(function (include) {
            return include.name == currentPath;
        }, this)) {
            context.includes.push({ name: currentPath, type: expression.associationInfo.ToType });
        }

        if (context.current.$expand.indexOf(propName) < 0) {
            context.current.$expand.push(propName);
            context.current[propName] = new ODataIncludeFragment(propName);
        }
        context.current = context.current[propName];
    },

    VisitFrameOperationExpression: function VisitFrameOperationExpression(expression, context) {
        this.Visit(expression.source, context);

        var opDef = expression.operation.memberDefinition;
        if (opDef && opDef.includeFrameName) {
            var opName = opDef.includeFrameName;
            var paramCounter = 0;
            var params = opDef.parameters || [{ name: "@expression" }];

            var args = params.map(function (item, index) {
                if (item.name === "@expression") {
                    return expression.source;
                } else {
                    return expression.parameters[paramCounter++];
                };
            });

            if (opDef.includeCompiler) {
                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];
                    var compilerType = _core.Container.resolveType(opDef.includeCompiler);
                    var compiler = new compilerType(this.provider);
                    var frameContext = { data: "", $expand: context.current };

                    if (arg && arg.value instanceof _core2.default.Queryable) {
                        var preparator = _core.Container.createQueryExpressionCreator(arg.value.entityContext);
                        var prep_expression = preparator.Visit(arg.value.expression);
                        arg = prep_expression;
                    }

                    var compiled = compiler.compile(arg, frameContext);

                    if (context.current['$operators'].indexOf(opName) < 0) {
                        context.current[opName] = [];
                        context.current['$operators'].push(opName);
                    }
                    context.current[opName].push(frameContext[opName] || frameContext.data);
                }
            } else if (opDef.implementation) {
                if (context.current['$operators'].indexOf(opName) < 0) {
                    context.current[opName] = [];
                    context.current['$operators'].push(opName);
                }
                context.current[opName].push(opDef.implementation());
            }
        }
    }
});