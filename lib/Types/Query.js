'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Query', null, null, {
    constructor: function constructor(expression, defaultType, context) {
        ///<param name="context" type="$data.EntityContext" />
        ///<field name="expression" type="$data.Expressions.ExpressionNode" />
        ///<field name="context" type="$data.EntityContext" />

        this.expression = expression;
        this.context = context;

        //TODO: expressions get as JSON string?!

        this.expressions = expression;
        this.defaultType = defaultType;
        this.result = [];
        this.rawDataList = [];
        this.modelBinderConfig = {};
        this.context = context;
    },

    rawDataList: { dataType: "Array" },
    result: { dataType: "Array" },
    resultType: {},
    buildResultSet: function buildResultSet(ctx) {
        var converter = new _index2.default.ModelBinder(this.context);
        this.result = converter.call(this.rawDataList, this.modelBinderConfig);
        return;
    },
    getEntitySets: function getEntitySets() {
        var ret = [];
        var ctx = this.context;

        var fn = function fn(expression) {
            if (expression instanceof _index2.default.Expressions.EntitySetExpression) {
                if (ctx._entitySetReferences[expression.elementType.name] && ret.indexOf(ctx._entitySetReferences[expression.elementType.name]) < 0) ret.push(ctx._entitySetReferences[expression.elementType.name]);
            }
            if (expression.source) fn(expression.source);
            if (expression.members) {
                for (var i = 0; i < expression.members.length; i++) {
                    fn(expression.members[i].expression);
                }
            }
        };

        fn(this.expression);

        return ret;
    }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];