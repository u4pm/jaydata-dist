'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.EntitySetExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(source, selector, params, instance) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntityExpression" />
        ///<param name="selector" type="$data.Expressions.MemberInfoExpression" />
        ///</signature>
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntityContextExpression" />
        ///<param name="selector" type="$data.Expressions.MemberInfoExpression" />
        ///</signature>
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///<param name="selector" type="$data.Expressions.ParametricQueryExpression" />
        ///</signature>
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///<param name="selector" type="$data.Expressions.CodeExpression" />
        ///</signature>
        _index.Guard.requireType("source", source, [_index2.default.Expressions.EntityContextExpression, _index2.default.Expressions.EntitySetExpression]);
        _index.Guard.requireType("selector", source, [_index2.default.Expressions.MemberInfoExpression, _index2.default.Expressions.CodeExpression, _index2.default.Expressions.ParametricQueryExpression]);

        this.source = source;
        this.selector = selector;
        this.params = params;
        //Object.defineProperty(this, "instance", { value: instance, enumerable: false, writable: true });
        this.instance = instance;

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

        ///TODO!!!
        this.storage_type = {};
        var c = findContext();
        switch (true) {
            case this.source instanceof _index2.default.Expressions.EntityContextExpression:
                _index.Guard.requireType("selector", selector, _index2.default.Expressions.MemberInfoExpression);
                this.elementType = selector.memberDefinition.elementType;
                this.storageModel = c.instance._storageModel.getStorageModel(this.elementType);
                break;
            case this.source instanceof _index2.default.Expressions.EntityExpression:
                _index.Guard.requireType("selector", selector, _index2.default.Expressions.AssociationInfoExpression);
                this.elementType = selector.associationInfo.ToType;
                this.storageModel = c.instance._storageModel.getStorageModel(this.elementType);
                break;
            case this.source instanceof _index2.default.Expressions.EntitySetExpression:
                if (selector instanceof _index2.default.Expressions.AssociationInfoExpression) {
                    this.elementType = selector.associationInfo.ToType, this.storageModel = c.instance._storageModel.getStorageModel(selector.associationInfo.ToType);
                } else {
                    this.elementType = this.source.elementType;
                    this.storageModel = this.source.storageModel;
                }
                break;
            case this.source instanceof _index2.default.Expressions.ServiceOperationExpression:
                this.elementType = this.source.elementType; //?????????
                this.storageModel = this.source.storageModel;
                break;
            case this.source instanceof _index2.default.Expressions.FindExpression:
                this.elementType = this.source.resultType;
                this.storageModel = c.instance._storageModel.getStorageModel(this.elementType);
                break;
            case this.source instanceof _index2.default.Expressions.DistinctExpression:
                _index.Guard.raise("distinct must be after all filter and map expressions in the chain!");
                break;
            default:
                _index.Guard.raise("take and skip must be the last expressions in the chain!");
                //Guard.raise("Unknown source type for EntitySetExpression: " + this.getType().name);
                break;
        }

        // suspicious code
        /*if (this.source instanceof $data.Expressions.EntitySetExpression) {
                //TODO: missing operation
        }*/
        //EntityTypeInfo
    },
    getMemberDefinition: function getMemberDefinition(name) {
        var memdef = this.elementType.getMemberDefinition(name);
        if (!memdef) {
            _index.Guard.raise(new _index.Exception("Unknown member " + name + " on type " + this.entityType.name, "MemberNotFound"));
        };
        memdef.storageModel = this.storageModel;
        return memdef;
    },

    instance: { enumerable: false },
    nodeType: { value: _index2.default.Expressions.ExpressionType.EntitySet, enumerable: true }
});

exports.default = _index2.default;
module.exports = exports['default'];