'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.CodeExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(source, parameters) {
        if (_index.Container.resolveType(_index.Container.getTypeName(source)) == _index2.default.String && source.replace(/^[\s\xA0]+/, "").match("^function") != "function" && !/^[^\.]*(=>)/.test(source.replace(/^[\s\xA0]+/, ""))) {
            source = "function (it) { return " + source + "; }";
        }

        this.source = source;
        this.parameters = parameters;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Code, enumerable: true }
});

exports.default = _index2.default;
module.exports = exports['default'];