'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.Validation.ValidationError', null, null, {
    constructor: function constructor(message, propertyDefinition, type) {
        ///<param name="message" type="string" />
        ///<param name="propertyDefinition" type="$data.MemberDefinition" />

        this.Message = message;
        this.PropertyDefinition = propertyDefinition;
        this.Type = type;
    },
    Type: { dataType: 'string' },
    Message: { dataType: "string" },
    PropertyDefinition: { dataType: _index2.default.MemberDefinition }
}, null);

_index2.default.Class.define('$data.Validation.EntityValidationBase', null, null, {

    ValidateEntity: function ValidateEntity(entity) {
        ///<param name="entity" type="$data.Entity" />
        return [];
    },

    ValidateEntityField: function ValidateEntityField(entity, memberDefinition) {
        ///<param name="entity" type="$data.Entity" />
        ///<param name="memberDefinition" type="$data.MemberDefinition" />
        return [];
    },

    getValidationValue: function getValidationValue(memberDefinition, validationName) {
        _index.Guard.raise("Pure class");
    },
    getValidationMessage: function getValidationMessage(memberDefinition, validationName, defaultMessage) {
        _index.Guard.raise("Pure class");
    }

}, null);

_index2.default.Validation = _index2.default.Validation || {};
_index2.default.Validation.Entity = new _index2.default.Validation.EntityValidationBase();

exports.default = _index2.default;
module.exports = exports['default'];