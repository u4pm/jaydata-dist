'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.storageProviders.YQL.YQLProvider', _core2.default.StorageProviderBase, null, {
    constructor: function constructor(cfg) {
        var provider = this;
        this.SqlCommands = [];
        this.context = {};
        this.extendedCreateNew = [];
        this.providerConfiguration = _core2.default.typeSystem.extend({
            YQLFormat: "format=json",
            YQLQueryUrl: "http://query.yahooapis.com/v1/public/yql?q=",
            YQLEnv: '',
            resultPath: ["query", "results"],
            resultSkipFirstLevel: true
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
                mapTo: ' LIKE ',
                expressionInParameter: false,
                parameters: [{ name: 'inStatement', dataType: _core2.default.String, prefix: '%', suffix: '%' }]
            },
            'startsWith': {
                dataType: _core2.default.String,
                allowedIn: _core2.default.Expressions.FilterExpression,
                mapTo: ' LIKE ',
                expressionInParameter: false,
                parameters: [{ name: 'inStatement', dataType: _core2.default.String, suffix: '%' }]
            },
            'endsWith': {
                dataType: _core2.default.String,
                allowedIn: _core2.default.Expressions.FilterExpression,
                mapTo: ' LIKE ',
                expressionInParameter: false,
                parameters: [{ name: 'inStatement', dataType: _core2.default.String, prefix: '%' }]
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
            and: { mapTo: ' AND ', dataType: _core2.default.Boolean, allowedIn: _core2.default.Expressions.FilterExpression },

            "in": { mapTo: " IN ", dataType: _core2.default.Boolean, resolvableType: [_core2.default.Array, _core2.default.Queryable], allowedIn: _core2.default.Expressions.FilterExpression }
        }
    },
    supportedUnaryOperators: {
        value: {}
    },
    supportedSetOperations: {
        value: {
            filter: {},
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
    fieldConverter: { value: _core2.default.YQLConverter },
    executeQuery: function executeQuery(query, callBack) {
        var self = this;
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);
        var schema = query.defaultType;
        var entitSetDefinition = query.context.getType().memberDefinitions.asArray().filter(function (m) {
            return m.elementType == schema;
        })[0] || {};
        var ctx = this.context;

        if (!this.AuthenticationProvider) this.AuthenticationProvider = new _core2.default.Authentication.Anonymous({});

        var sql;
        try {
            sql = this._compile(query);
        } catch (e) {
            callBack.error(e);
            return;
        }

        var includes = [];
        var requestData = {
            url: this.providerConfiguration.YQLQueryUrl + encodeURIComponent(sql.queryText) + "&" + this.providerConfiguration.YQLFormat + (this.providerConfiguration.YQLEnv ? "&env=" + this.providerConfiguration.YQLEnv : ""),
            dataType: "JSON",
            success: function success(data, textStatus, jqXHR) {
                var resultData = self._preProcessData(data, entitSetDefinition);
                if (resultData == false) {
                    callBack.success(query);
                    return;
                }

                query.rawDataList = resultData;
                if (entitSetDefinition.anonymousResult) {
                    query.rawDataList = resultData;
                    callBack.success(query);
                    return;
                } else {
                    var compiler = _core.Container.createModelBinderConfigCompiler(query, []);
                    compiler.Visit(query.expression);
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
    _preProcessData: function _preProcessData(jsonResult, entityDef) {
        var resultData = jsonResult;
        var depths = entityDef.resultPath != undefined ? entityDef.resultPath : this.providerConfiguration.resultPath;
        for (var i = 0; i < depths.length; i++) {
            if (resultData[depths[i]]) resultData = resultData[depths[i]];else {
                return false;
            }
        }

        var skipFirstLevel = entityDef.resultSkipFirstLevel != undefined ? entityDef.resultSkipFirstLevel : this.providerConfiguration.resultSkipFirstLevel;
        if (skipFirstLevel == true) {
            var keys = Object.keys(resultData);
            if (keys.length == 1 && (resultData[keys[0]] instanceof Array || !entityDef.anonymousResult)) resultData = resultData[keys[0]];
        }

        if (resultData.length) {
            return resultData;
        } else return [resultData];
    },
    _compile: function _compile(query) {
        var sqlText = _core.Container.createYQLCompiler().compile(query);
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
        _core.Guard.raise(new _core.Exception("Not Implemented", "Not Implemented"));
    }
}, null);

_core2.default.StorageProviderBase.registerProvider("YQL", _core2.default.storageProviders.YQL.YQLProvider);