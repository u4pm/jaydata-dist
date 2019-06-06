'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_TypeSystem2.default.Number = typeof Number !== 'undefined' ? Number : function JayNumber() {};
_TypeSystem2.default.Date = typeof Date !== 'undefined' ? Date : function JayDate() {};
_TypeSystem2.default.String = typeof String !== 'undefined' ? String : function JayString() {};
_TypeSystem2.default.Boolean = typeof Boolean !== 'undefined' ? Boolean : function JayBoolean() {};
_TypeSystem2.default.Array = typeof Array !== 'undefined' ? Array : function JayArray() {};
_TypeSystem2.default.Object = typeof Object !== 'undefined' ? Object : function JayObject() {};
_TypeSystem2.default.Function = Function;

_TypeSystem2.default.Byte = function JayByte() {};
_TypeSystem2.default.SByte = function JaySByte() {};
_TypeSystem2.default.Decimal = function JayDecimal() {};
_TypeSystem2.default.Float = _TypeSystem2.default.Single = function JayFloat() {};
_TypeSystem2.default.Integer = function JayInteger() {};
_TypeSystem2.default.Int16 = function JayInt16(v) {};
_TypeSystem2.default.Int32 = function JayInt32() {};
_TypeSystem2.default.Int64 = function JayInt64(v) {};
_TypeSystem2.default.ObjectID = typeof _TypeSystem2.default.mongoDBDriver !== 'undefined' && typeof _TypeSystem2.default.mongoDBDriver.ObjectID !== 'undefined' ? _TypeSystem2.default.mongoDBDriver.ObjectID : function JayObjectID() {};
_TypeSystem2.default.Time = function JayTime() {};
_TypeSystem2.default.Day = function JayDay() {};
_TypeSystem2.default.Duration = function JayDuration() {};
_TypeSystem2.default.DateTimeOffset = function JayDateTimeOffset(val) {
    this.value = val;
};
_TypeSystem2.default.DateTimeOffset.prototype.toJSON = function () {
    return this.value instanceof Date ? this.value.toISOString() : this.value;
};

_TypeSystem2.default.Container.registerType(["$data.Number", "number", "JayNumber", "double"], _TypeSystem2.default.Number);
_TypeSystem2.default.Container.registerType(["$data.Integer", "int", "integer", "JayInteger"], _TypeSystem2.default.Integer);
_TypeSystem2.default.Container.registerType(["$data.Int32", "int32", "JayInt32"], _TypeSystem2.default.Int32);
_TypeSystem2.default.Container.registerType(["$data.Byte", "byte", "JayByte"], _TypeSystem2.default.Byte);
_TypeSystem2.default.Container.registerType(["$data.SByte", "sbyte", "JaySByte"], _TypeSystem2.default.SByte);
_TypeSystem2.default.Container.registerType(["$data.Decimal", "decimal", "JayDecimal"], _TypeSystem2.default.Decimal);
_TypeSystem2.default.Container.registerType(["$data.Float", "$data.Single", "float", "single", "JayFloat"], _TypeSystem2.default.Float);
_TypeSystem2.default.Container.registerType(["$data.Int16", "int16", "word", "JayInt16"], _TypeSystem2.default.Int16);
_TypeSystem2.default.Container.registerType(["$data.Int64", "int64", "long", "JayInt64"], _TypeSystem2.default.Int64);
_TypeSystem2.default.Container.registerType(["$data.String", "string", "text", "character", "JayString"], _TypeSystem2.default.String);
_TypeSystem2.default.Container.registerType(["$data.Array", "array", "Array", "[]", "JayArray"], _TypeSystem2.default.Array, function () {
    return _TypeSystem2.default.Array.apply(undefined, arguments);
});
_TypeSystem2.default.Container.registerType(["$data.Date", "datetime", "date", "JayDate"], _TypeSystem2.default.Date);
_TypeSystem2.default.Container.registerType(["$data.Time", "time", "JayTime"], _TypeSystem2.default.Time);
_TypeSystem2.default.Container.registerType(["$data.Day", "day", "JayDay"], _TypeSystem2.default.Day);
_TypeSystem2.default.Container.registerType(["$data.Duration", "duration", "JayDuration"], _TypeSystem2.default.Duration);
_TypeSystem2.default.Container.registerType(["$data.DateTimeOffset", "offset", "datetimeoffset", "JayDateTimeOffset"], _TypeSystem2.default.DateTimeOffset);
_TypeSystem2.default.Container.registerType(["$data.Boolean", "bool", "boolean", "JayBoolean"], _TypeSystem2.default.Boolean);
_TypeSystem2.default.Container.registerType(["$data.Object", "Object", "object", "{}", "JayObject"], _TypeSystem2.default.Object);
_TypeSystem2.default.Container.registerType(["$data.Function", "Function", "function"], _TypeSystem2.default.Function);
_TypeSystem2.default.Container.registerType(['$data.ObjectID', 'ObjectID', 'objectId', 'objectid', 'ID', 'Id', 'id', 'JayObjectID'], _TypeSystem2.default.ObjectID);

exports.default = _TypeSystem2.default;
module.exports = exports['default'];