'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ComplexTypeExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(source, selector) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntityExpression" />
        ///<param name="selector" type="$data.Expressions.MemberInfoExpression" />
        ///</signature>
        ///<signature>
        ///<param name="source" type="$data.Expressions.ComplexTypeExpression" />
        ///<param name="selector" type="$data.Expressions.MemberInfoExpression" />
        ///</signature>
        _index.Guard.requireType("source", source, [_index2.default.Expressions.EntityExpression, _index2.default.Expressions.ComplexTypeExpression]);
        _index.Guard.requireType("selector", selector, [_index2.default.Expressions.EntityExpression, _index2.default.Expressions.MemberInfoExpression]);
        this.source = source;
        this.selector = selector;
        var memDef = source.entityType.getMemberDefinition(selector.memberName);
        var dt = memDef.elementType || memDef.dataType;
        var t = _index.Container.resolveType(dt);
        this.entityType = t;
    },

    getMemberDefinition: function getMemberDefinition(name) {
        return this.entityType.getMemberDefinition(name);
    },

    nodeType: { value: _index2.default.Expressions.ExpressionType.Com }
});

exports.default = _index2.default;
module.exports = exports['default'];