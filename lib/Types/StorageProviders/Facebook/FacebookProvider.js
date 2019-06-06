'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.storageProviders.Facebook.FacebookProvider', _core2.default.StorageProviderBase, null, {
    constructor: function constructor(cfg) {
        var provider = this;
        this.SqlCommands = [];
        this.context = {};
        this.providerConfiguration = _core2.default.typeSystem.extend({
            FQLFormat: "format=json",
            FQLQueryUrl: "https://graph.facebook.com/fql?q=",
            Access_Token: ''
        }, cfg);
        this.initializeStore = function (callBack) {
            callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);
            callBack.success(this.context);
        };
    },
    AuthenticationProvider: { dataType: '$data.Authentication.AuthenticationBase', enumerable: false },
    supportedDataTypes: { value: [_core2.default.Integer, _core2.default.Number, _core2.default.Date, _core2.default.String, _core2.default.Boolean, _core2.default.Blob, _core2.default.Array], writable: false },
    supportedFieldOperations: {
        value: {
            'contains': {
                dataType: _core2.default.String,
                allowedIn: _core2.default.Expressions.FilterExpression,
                mapTo: "strpos",
                parameters: [{ name: "@expression", dataType: _core2.default.String }, { name: "strFragment", dataType: _core2.default.String }],
                rigthValue: ') >= 0'
            },
            'startsWith': {
                dataType: _core2.default.String,
                allowedIn: _core2.default.Expressions.FilterExpression,
                mapTo: "strpos",
                parameters: [{ name: "@expression", dataType: _core2.default.String }, { name: "strFragment", dataType: _core2.default.String }],
                rigthValue: ') = 0'
            },
            'strpos': {
                dataType: _core2.default.Integer,
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression],
                mapTo: "strpos",
                parameters: [{ name: "@expression", dataType: _core2.default.String }, { name: "strFragment", dataType: _core2.default.String }]
            },
            'substr': {
                dataType: _core2.default.String,
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression],
                mapTo: "substr",
                parameters: [{ name: "@expression", dataType: _core2.default.String }, { name: "startIdx", dataType: _core2.default.Number }, { name: "length", dataType: _core2.default.Number }]
            },
            'strlen': {
                dataType: _core2.default.Integer,
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression],
                mapTo: "strlen",
                parameters: [{ name: "@expression", dataType: _core2.default.String }]
            }

        },
        enumerable: true,
        writable: true
    },
    supportedBinaryOperators: {
        value: {
            equal: { mapTo: ' = ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },
            notEqual: { mapTo: ' != ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },
            equalTyped: { mapTo: ' = ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },
            notEqualTyped: { mapTo: ' != ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },
            greaterThan: { mapTo: ' > ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },
            greaterThanOrEqual: { mapTo: ' >= ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },

            lessThan: { mapTo: ' < ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },
            lessThenOrEqual: { mapTo: ' <= ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },
            or: { mapTo: ' OR ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },
            and: { mapTo: ' AND ', dataType: _core2.default.Booleanv },
            'in': { mapTo: ' IN ', dataType: _core2.default.Boolean, resolvableType: [_core2.default.Array, _core2.default.Queryable], allowedIn: _core2.default.Expressions.FilterExpression }
        }
    },
    supportedUnaryOperators: {
        value: {}
    },
    fieldConverter: { value: _core2.default.FacebookConverter },
    supportedSetOperations: {
        value: {
            filter: {},
            length: {},
            map: {},
            forEach: {},
            toArray: {},
            single: {},
            take: {},
            skip: {},
            orderBy: {},
            orderByDescending: {},
            first: {}
        },
        enumerable: true,
        writable: true
    },
    executeQuery: function executeQuery(query, callBack) {
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);

        if (!this.AuthenticationProvider) this.AuthenticationProvider = new _core2.default.Authentication.Anonymous({});

        var sql;
        try {
            sql = this._compile(query);
        } catch (e) {
            callBack.error(e);
            return;
        }

        var schema = query.defaultType;
        var ctx = this.context;

        var includes = [];
        if (!sql.selectMapping) this._discoverType('', schema, includes);

        var requestUrl = this.providerConfiguration.FQLQueryUrl + encodeURIComponent(sql.queryText) + "&" + this.providerConfiguration.FQLFormat;
        if (this.providerConfiguration.Access_Token) {
            requestUrl += '&access_token=' + this.providerConfiguration.Access_Token;
        }

        var requestData = {
            url: requestUrl,
            dataType: "JSON",
            success: function success(data, textStatus, jqXHR) {
                query.rawDataList = data.data;
                var compiler = _core.Container.createModelBinderConfigCompiler(query, []);
                compiler.Visit(query.expression);

                if (query.expression instanceof _core2.default.Expressions.CountExpression) {
                    query.rawDataList = [{ cnt: data.data.length }];
                }
                callBack.success(query);
            },
            error: function error(jqXHR, textStatus, errorThrow) {
                var errorData = {};
                try {
                    errorData = JSON.parse(jqXHR.responseText).error;
                } catch (e) {
                    errorData = errorThrow + ': ' + jqXHR.responseText;
                }
                callBack.error(errorData);
            }
        };

        this.context.prepareRequest.call(this, requestData);
        this.AuthenticationProvider.CreateRequest(requestData);
    },
    _discoverType: function _discoverType(dept, type, result) {
        type.memberDefinitions.getPublicMappedProperties().forEach(function (memDef) {
            var type = _core.Container.resolveType(memDef.dataType);

            if (type.isAssignableTo || type == Array) {
                var name = dept ? dept + '.' + memDef.name : memDef.name;

                if (type == Array || type.isAssignableTo(_core2.default.EntitySet)) {
                    if (memDef.inverseProperty) type = _core.Container.resolveType(memDef.elementType);else return;
                }

                result.push({ name: name, type: type });
                this._discoverType(name, type, result);
            }
        }, this);
    },
    _compile: function _compile(query) {
        var sqlText = _core.Container.createFacebookCompiler().compile(query);
        return sqlText;
    },
    getTraceString: function getTraceString(query) {
        if (!this.AuthenticationProvider) this.AuthenticationProvider = new _core2.default.Authentication.Anonymous({});

        var sqlText = this._compile(query);
        return sqlText;
    },
    setContext: function setContext(ctx) {
        this.context = ctx;
    },
    saveChanges: function saveChanges(callBack) {
        _core.Guard.raise(new _core.Exception("Not implemented", "Not implemented"));
    }
}, null);

_core2.default.StorageProviderBase.registerProvider("Facebook", _core2.default.storageProviders.Facebook.FacebookProvider);