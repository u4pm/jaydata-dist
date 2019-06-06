'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.Validation.Defaults', null, null, null, {
    validators: {
        value: {
            required: function required(value, definedValue) {
                return !_index.Guard.isNullOrUndefined(value);
            },
            customValidator: function customValidator(value, definedValue) {
                return _index.Guard.isNullOrUndefined(value) || typeof definedValue == "function" ? definedValue(value) : true;
            },

            minValue: function minValue(value, definedValue) {
                return _index.Guard.isNullOrUndefined(value) || value >= definedValue;
            },
            maxValue: function maxValue(value, definedValue) {
                return _index.Guard.isNullOrUndefined(value) || value <= definedValue;
            },

            minLength: function minLength(value, definedValue) {
                return _index.Guard.isNullOrUndefined(value) || value.length >= definedValue;
            },
            maxLength: function maxLength(value, definedValue) {
                return _index.Guard.isNullOrUndefined(value) || value.length <= definedValue;
            },
            length: function length(value, definedValue) {
                return _index.Guard.isNullOrUndefined(value) || value.length == definedValue;
            },
            regex: function regex(value, definedValue) {
                return _index.Guard.isNullOrUndefined(value) || value.match(typeof definedValue === 'string' ? new RegExp(definedValue.indexOf('/') === 0 && definedValue.lastIndexOf('/') === definedValue.length - 1 ? definedValue.slice(1, -1) : definedValue) : definedValue);
            }
        }
    },

    _getGroupValidations: function _getGroupValidations(validations) {
        var validators = {};
        if (Array.isArray(validations)) {
            for (var i = 0; i < validations.length; i++) {
                var validator = validations[i];
                if (typeof this.validators[validator] === 'function') {
                    validators[validator] = this.validators[validator];
                }
            }
        }

        return validators;
    }
});

_index2.default.Class.define('$data.Validation.EntityValidation', _index2.default.Validation.EntityValidationBase, null, {

    ValidateEntity: function ValidateEntity(entity) {
        ///<param name="entity" type="$data.Entity" />

        var errors = [];
        entity.getType().memberDefinitions.getPublicMappedProperties().forEach(function (memDef) {
            errors = errors.concat(this.ValidateEntityField(entity, memDef, undefined, true));
        }, this);
        return errors;
    },
    ValidateEntityField: function ValidateEntityField(entity, memberDefinition, newValue, valueNotSet) {
        ///<param name="entity" type="$data.Entity" />
        ///<param name="memberDefinition" type="$data.MemberDefinition" />
        var errors = [];
        var resolvedType = _index.Container.resolveType(memberDefinition.dataType);
        var typeName = _index.Container.resolveName(resolvedType);
        var value = !valueNotSet ? newValue : entity[memberDefinition.name];

        if (!memberDefinition.inverseProperty && resolvedType && typeof resolvedType.isAssignableTo === 'function' && resolvedType.isAssignableTo(_index2.default.Entity)) {
            typeName = _index2.default.Entity.fullName;
        }

        this.fieldValidate(entity, memberDefinition, value, errors, typeName);
        return errors;
    },

    getValidationValue: function getValidationValue(memberDefinition, validationName) {
        var value;
        if (memberDefinition[validationName] && memberDefinition[validationName].value) value = memberDefinition[validationName].value;else value = memberDefinition[validationName];

        if (this.convertableValidation[validationName]) {
            var typeToConvert;
            if (this.convertableValidation[validationName] === true) {
                typeToConvert = memberDefinition.type;
            } else {
                typeToConvert = this.convertableValidation[validationName];
            }

            if (typeToConvert) value = _index.Container.convertTo(value, typeToConvert, memberDefinition.elementType);
        }

        return value;
    },
    getValidationMessage: function getValidationMessage(memberDefinition, validationName, defaultMessage) {
        var eMessage = defaultMessage;
        if (_typeof(memberDefinition[validationName]) == "object" && memberDefinition[validationName].message) eMessage = memberDefinition[validationName].message;else if (memberDefinition.errorMessage) eMessage = memberDefinition.errorMessage;

        return eMessage;
    },
    createValidationError: function createValidationError(memberDefinition, validationName, defaultMessage) {
        return new _index2.default.Validation.ValidationError(this.getValidationMessage(memberDefinition, validationName, defaultMessage), memberDefinition, validationName);
    },

    convertableValidation: {
        value: {
            required: '$data.Boolean',
            minValue: true,
            maxValue: true,
            minLength: '$data.Integer',
            maxLength: '$data.Integer',
            length: '$data.Integer'
        }

    },
    supportedValidations: {
        value: {
            //'$data.Entity': $data.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.ObjectID': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.Byte': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.SByte': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Decimal': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Float': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Number': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Int16': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Integer': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Int32': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Int64': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.String': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minLength', 'maxLength', 'length', 'regex']),
            '$data.Date': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.DateTimeOffset': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Time': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Day': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minValue', 'maxValue']),
            '$data.Duration': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.Boolean': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.Array': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'length']),
            '$data.Object': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.Guid': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.Blob': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator', 'minLength', 'maxLength', 'length']),
            '$data.GeographyPoint': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeographyLineString': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeographyPolygon': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeographyMultiPoint': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeographyMultiLineString': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeographyMultiPolygon': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeographyCollection': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeometryPoint': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeometryLineString': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeometryPolygon': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeometryMultiPoint': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeometryMultiLineString': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeometryMultiPolygon': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator']),
            '$data.GeometryCollection': _index2.default.Validation.Defaults._getGroupValidations(['required', 'customValidator'])
        }
    },

    fieldValidate: function fieldValidate(entity, memberDefinition, value, errors, validationTypeName) {
        ///<param name="memberDefinition" type="$data.MemberDefinition" />
        ///<param name="value" type="Object" />
        ///<param name="errors" type="Array" />
        ///<param name="validationTypeName" type="string" />
        if (entity.entityState == _index2.default.EntityState.Modified && entity.changedProperties && entity.changedProperties.indexOf(memberDefinition) < 0) return;

        var validatonGroup = this.supportedValidations[validationTypeName];
        if (validatonGroup) {
            var validations = Object.keys(validatonGroup);
            validations.forEach(function (validation) {
                if (memberDefinition[validation] && validatonGroup[validation] && !validatonGroup[validation].call(entity, value, this.getValidationValue(memberDefinition, validation))) errors.push(this.createValidationError(memberDefinition, validation, 'Validation error!'));
            }, this);

            if (validationTypeName === _index2.default.Entity.fullName && value instanceof _index2.default.Entity && !value.isValid()) {
                errors.push(this.createValidationError(memberDefinition, 'ComplexProperty', 'Validation error!'));
            }
        }
    }

}, null);

_index2.default.Validation.Entity = new _index2.default.Validation.EntityValidation();

exports.default = _index2.default;
module.exports = exports['default'];