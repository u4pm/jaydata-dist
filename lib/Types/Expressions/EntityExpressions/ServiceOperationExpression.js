'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ServiceOperationExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(source, selector, params, cfg, boundItem) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntityContextExpression" />
        ///<param name="selector" type="$data.Expressions.MemberInfoExpression" />
        ///<param name="params" type="$data.Array" />
        ///<param name="cfg" type="$data.Object" />
        ///</signature>
        _index.Guard.requireType("source", source, [_index2.default.Expressions.EntityContextExpression]);
        _index.Guard.requireType("selector", source, [_index2.default.Expressions.MemberInfoExpression]);

        this.source = source;
        this.selector = selector;
        this.params = params;
        this.cfg = cfg;
        this.boundItem = boundItem;

        function findContext() {
            //TODO: use source from function parameter and return a value at the end of the function
            var r = source;
            while (r) {
                if (r instanceof _index2.default.Expressions.EntityContextExpression) {
                    return r;
                }
                r = r.source;
            }
        }

        var c = findContext();
        switch (true) {
            case this.source instanceof _index2.default.Expressions.EntityContextExpression:
                this.elementType = cfg.elementType ? _index.Container.resolveType(cfg.elementType) : this.elementType ? _index.Container.resolveType(cfg.returnType) : null;
                this.storageModel = cfg.elementType ? c.instance._storageModel.getStorageModel(_index.Container.resolveType(cfg.elementType)) : null;
                break;
            default:
                _index.Guard.raise("Unknown source type for EntitySetExpression: " + this.source.getType().name);
        }
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.ServiceOperation, enumerable: true }
});

exports.default = _index2.default;
module.exports = exports['default'];