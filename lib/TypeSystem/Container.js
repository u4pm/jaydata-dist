'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContainerInstance = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.ContainerCtor = ContainerCtor;

var _initializeJayData = require('./initializeJayData.js');

var _initializeJayData2 = _interopRequireDefault(_initializeJayData);

var _jaydataErrorHandler = require('jaydata-error-handler');

var _Extensions = require('./Extensions.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Container = new ContainerCtor();

var ContainerInstance = exports.ContainerInstance = Container;

function ContainerCtor(parentContainer) {
  var parent = parentContainer;
  if (parent) {
    parent.addChildContainer(this);
  }

  var classNames = {};
  var consolidatedClassNames = [];
  var classTypes = [];

  this.classNames = classNames;
  this.consolidatedClassNames = consolidatedClassNames;
  this.classTypes = classTypes;

  var mappedTo = [];
  this.mappedTo = mappedTo;

  var self = this;

  this["holder"] = null;

  var IoC = function IoC(type, parameters) {
    var t = self.resolveType(type);
    var inst = Object.create(t.prototype);
    t.apply(inst, parameters);
    return inst;
  };

  var pendingResolutions = {};
  this.pendingResolutions = pendingResolutions;

  function addPendingResolution(name, onResolved) {
    pendingResolutions[name] = pendingResolutions[name] || [];
    pendingResolutions[name].push(onResolved);
  }

  this.addChildContainer = function (container) {
    //children.push(container);
  };

  this.createInstance = function (type, parameters) {
    return IoC(type, parameters);
  };

  this.mapType = function (aliasTypeOrName, realTypeOrName) {
    _jaydataErrorHandler.Guard.requireValue("aliasType", aliasTypeOrName);
    _jaydataErrorHandler.Guard.requireValue("realType", realTypeOrName);
    var aliasT = this.getType(aliasTypeOrName);
    var realT = this.getType(realTypeOrName);
    var aliasPos = classTypes.indexOf(aliasT);
    var realPos = classTypes.indexOf(realT);
    mappedTo[aliasPos] = realPos;
  },

  //this.resolve = function (type, parameters) {
  //    var classFunction = this.resolveType(type, parameters);
  //    return new classFunction(parameters);
  //};


  this.isPrimitiveType = function (type) {
    var t = this.resolveType(type);

    switch (true) {
      case t === Number:
      case t === String:
      case t === Date:
      case t === Boolean:
      case t === Array:
      case t === Object:

      case t === _initializeJayData2.default.Number:
      case t === _initializeJayData2.default.Integer:
      case t === _initializeJayData2.default.Date:
      case t === _initializeJayData2.default.String:
      case t === _initializeJayData2.default.Boolean:
      case t === _initializeJayData2.default.Array:
      case t === _initializeJayData2.default.Object:
      case t === _initializeJayData2.default.Guid:

      case t === _initializeJayData2.default.Byte:
      case t === _initializeJayData2.default.SByte:
      case t === _initializeJayData2.default.Decimal:
      case t === _initializeJayData2.default.Float:
      case t === _initializeJayData2.default.Int16:
      case t === _initializeJayData2.default.Int32:
      case t === _initializeJayData2.default.Int64:
      case t === _initializeJayData2.default.DateTimeOffset:
      case t === _initializeJayData2.default.Time:
      case t === _initializeJayData2.default.Day:
      case t === _initializeJayData2.default.Duration:

      case t === _initializeJayData2.default.SimpleBase:
      case t === _initializeJayData2.default.Geospatial:
      case t === _initializeJayData2.default.GeographyBase:
      case t === _initializeJayData2.default.GeographyPoint:
      case t === _initializeJayData2.default.GeographyLineString:
      case t === _initializeJayData2.default.GeographyPolygon:
      case t === _initializeJayData2.default.GeographyMultiPoint:
      case t === _initializeJayData2.default.GeographyMultiLineString:
      case t === _initializeJayData2.default.GeographyMultiPolygon:
      case t === _initializeJayData2.default.GeographyCollection:
      case t === _initializeJayData2.default.GeometryBase:
      case t === _initializeJayData2.default.GeometryPoint:
      case t === _initializeJayData2.default.GeometryLineString:
      case t === _initializeJayData2.default.GeometryPolygon:
      case t === _initializeJayData2.default.GeometryMultiPoint:
      case t === _initializeJayData2.default.GeometryMultiLineString:
      case t === _initializeJayData2.default.GeometryMultiPolygon:
      case t === _initializeJayData2.default.GeometryCollection:

        return true;
      default:
        return false;
    }
  };

  this.resolveName = function (type) {
    var t = this.resolveType(type);
    var tPos = classTypes.indexOf(t);
    return consolidatedClassNames[tPos];
  };

  this.resolveType = function (typeOrName, onResolved) {
    var t = typeOrName;
    t = this.getType(t, onResolved ? true : false, onResolved);
    var posT = classTypes.indexOf(t);
    return typeof mappedTo[posT] === 'undefined' ? t : classTypes[mappedTo[posT]];
  };

  this.getType = function (typeOrName, doNotThrow, onResolved) {
    _jaydataErrorHandler.Guard.requireValue("typeOrName", typeOrName);
    if (typeof typeOrName === 'function') {
      return typeOrName;
    };

    if (!(typeOrName in classNames)) {
      if (parent) {
        var tp = parent.getType(typeOrName, true);
        if (tp) return tp;
      }
      if (onResolved) {
        addPendingResolution(typeOrName, onResolved);
        return;
      } else if (doNotThrow) {
        return undefined;
      } else {
        _jaydataErrorHandler.Guard.raise(new _jaydataErrorHandler.Exception("Unable to resolve type:" + typeOrName));
      }
    };
    var result = classTypes[classNames[typeOrName]];
    if (onResolved) {
      onResolved(result);
    }
    return result;
  };

  this.getName = function (typeOrName) {
    var t = this.getType(typeOrName);
    var tPos = classTypes.indexOf(t);
    if (tPos == -1) _jaydataErrorHandler.Guard.raise("unknown type to request name for: " + typeOrName);
    return consolidatedClassNames[tPos];
  };

  this.getTypes = function () {
    var keys = Object.keys(classNames);
    var ret = [];
    for (var i = 0; i < keys.length; i++) {
      var className = keys[i];
      ret.push({
        name: className,
        type: classTypes[classNames[className]],
        toString: function toString() {
          return this.name;
        }
      });
    }
    return ret;
  };

  //this.getTypeName( in type);
  //this.resolveType()
  //this.inferTypeFromValue = function (value) {

  this.getTypeName = function (value) {
    //TODO refactor
    switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
      case 'object':
        if (value == null) return '$data.Object';
        if (value instanceof Array) return '$data.Array';
        if (value.getType) return value.getType().fullName;
        if (value instanceof Date) return '$data.Date';
        if (value instanceof _initializeJayData2.default.Guid) return '$data.Guid';
        if (value instanceof _initializeJayData2.default.DateTimeOffset) return '$data.DateTimeOffset';
        if (value instanceof _initializeJayData2.default.GeographyPoint) return '$data.GeographyPoint';
        if (value instanceof _initializeJayData2.default.GeographyLineString) return '$data.GeographyLineString';
        if (value instanceof _initializeJayData2.default.GeographyPolygon) return '$data.GeographyPolygon';
        if (value instanceof _initializeJayData2.default.GeographyMultiPoint) return '$data.GeographyMultiPoint';
        if (value instanceof _initializeJayData2.default.GeographyMultiLineString) return '$data.GeographyMultiLineString';
        if (value instanceof _initializeJayData2.default.GeographyMultiPolygon) return '$data.GeographyMultiPolygon';
        if (value instanceof _initializeJayData2.default.GeographyCollection) return '$data.GeographyCollection';
        if (value instanceof _initializeJayData2.default.GeographyBase) return '$data.GeographyBase';
        if (value instanceof _initializeJayData2.default.GeometryPoint) return '$data.GeometryPoint';
        if (value instanceof _initializeJayData2.default.GeometryLineString) return '$data.GeometryLineString';
        if (value instanceof _initializeJayData2.default.GeometryPolygon) return '$data.GeometryPolygon';
        if (value instanceof _initializeJayData2.default.GeometryMultiPoint) return '$data.GeometryMultiPoint';
        if (value instanceof _initializeJayData2.default.GeometryMultiLineString) return '$data.GeometryMultiLineString';
        if (value instanceof _initializeJayData2.default.GeometryMultiPolygon) return '$data.GeometryMultiPolygon';
        if (value instanceof _initializeJayData2.default.GeometryCollection) return '$data.GeometryCollection';
        if (value instanceof _initializeJayData2.default.GeometryBase) return '$data.GeometryBase';
        if (value instanceof _initializeJayData2.default.Geospatial) return '$data.Geospatial';
        if (value instanceof _initializeJayData2.default.SimpleBase) return '$data.SimpleBase';
        if (typeof value.toHexString === 'function') return '$data.ObjectID';
      //if(value instanceof "number") return
      default:
        return typeof value === 'undefined' ? 'undefined' : _typeof(value);
    }
  };

  this.isTypeRegistered = function (typeOrName) {
    if (typeof typeOrName === 'function') {
      return classTypes.indexOf(typeOrName) > -1;
    } else {
      return typeOrName in classNames;
    }
  };

  this.unregisterType = function (type) {
    _jaydataErrorHandler.Guard.raise("Unimplemented");
  };

  this.getDefault = function (typeOrName) {
    var t = this.resolveType(typeOrName);
    switch (t) {
      case _initializeJayData2.default.Number:
        return 0.0;
      case _initializeJayData2.default.Float:
        return 0.0;
      case _initializeJayData2.default.Decimal:
        return '0.0';
      case _initializeJayData2.default.Integer:
        return 0;
      case _initializeJayData2.default.Int16:
        return 0;
      case _initializeJayData2.default.Int32:
        return 0;
      case _initializeJayData2.default.Int64:
        return '0';
      case _initializeJayData2.default.Byte:
        return 0;
      case _initializeJayData2.default.SByte:
        return 0;
      case _initializeJayData2.default.String:
        return null;
      case _initializeJayData2.default.Boolean:
        return false;
      default:
        return null;
    }
  };

  //name array ['', '', '']
  this.getIndex = function (typeOrName) {
    var t = this.resolveType(typeOrName);
    return classTypes.indexOf(t);
  };

  this.resolveByIndex = function (index) {
    return classTypes[index];
  };

  this.registerType = function (nameOrNamesArray, type, factoryFunc) {
    ///<signature>
    ///<summary>Registers a type and optionally a lifetimeManager with a name
    ///that can be used to later resolve the type or create new instances</summary>
    ///<param name="nameOrNamesArray" type="Array">The names of the type</param>
    ///<param name="type" type="Function">The type to register</param>
    ///<param name="instanceManager" type="Function"></param>
    ///</signature>
    ///<signature>
    ///<summary>Registers a new type that </summary>
    ///<param name="aliasType" type="Function">The name of the type</param>
    ///<param name="actualType" type="Function">The type to register</param>
    ///</signature>


    ///TODO remove
    /*if (typeof typeNameOrAlias === 'string') {
        if (classNames.indexOf(typeNameOrAlias) > -1) {
            Guard.raise("Type already registered. Remove first");
        }
    }*/

    if (!nameOrNamesArray) {
      return;
    }

    //todo add ('number', 'number')
    if (typeof type === "string") {
      type = self.resolveType(type);
    }

    var namesArray = [];
    if (typeof nameOrNamesArray === 'string') {
      var tmp = [];
      tmp.push(nameOrNamesArray);
      namesArray = tmp;
    } else {
      namesArray = nameOrNamesArray;
    }

    for (var i = 0; i < namesArray.length; i++) {
      var parts = namesArray[i].split('.');
      var item = {};
      item.shortName = parts[parts.length - 1];
      item.fullName = namesArray[i];
      namesArray[i] = item;
    }

    //if (type.


    var creatorFnc = function creatorFnc() {
      return IoC(type, arguments);
    };

    if (typeof intellisense !== 'undefined') {
      intellisense.annotate(creatorFnc, type);
    }

    for (var i = 0, l = namesArray.length; i < l; i++) {
      var item = namesArray[i];
      if (!("create" + item.shortName in self)) {
        if (typeof factoryFunc === 'function') {
          self["create" + item.shortName] = factoryFunc;
        } else {
          self["create" + item.shortName] = creatorFnc;
        }
      }

      var typePos = classTypes.indexOf(type);
      if (typePos == -1) {
        //new type
        typePos = classTypes.push(type) - 1;
        var fn = item.fullName;
        consolidatedClassNames[typePos] = item.fullName;
      };

      classNames[item.fullName] = typePos;

      var pending = pendingResolutions[item.fullName] || [];
      if (pending.length > 0) {
        pending.forEach(function (t) {
          t(type);
        });
        pendingResolutions[item.fullName] = [];
      }
    }
    if (parent) {
      parent.registerType.apply(parent, arguments);
    }
    if (!type.name) {
      try {
        type.name = namesArray[0].shortName;
      } catch (err) {}
    }
  };

  var _converters = {
    from: {},
    to: {}
  };
  this.converters = _converters;

  this.convertTo = function (value, tType, eType /*if Array*/, options) {
    _jaydataErrorHandler.Guard.requireValue("typeOrName", tType);

    if (_jaydataErrorHandler.Guard.isNullOrUndefined(value)) return value;

    var sourceTypeName = Container.getTypeName(value);
    var sourceType = Container.resolveType(sourceTypeName);
    var sourceTypeName = Container.resolveName(sourceType);
    var targetType = Container.resolveType(tType);
    var targetTypeName = Container.resolveName(targetType);

    var result;
    try {
      if (typeof targetType['from' + sourceTypeName] === 'function') {
        // target from
        result = targetType['from' + sourceTypeName].apply(targetType, arguments);
      } else if (typeof sourceType['to' + targetTypeName] === 'function') {
        // source to
        result = sourceType['to' + targetTypeName].apply(sourceType, arguments);
      } else if (_converters.to[targetTypeName] && _converters.to[targetTypeName][sourceTypeName]) {
        // target from source
        result = _converters.to[targetTypeName][sourceTypeName].apply(_converters, arguments);
      } else if (_converters.from[sourceTypeName] && _converters.from[sourceTypeName][targetTypeName]) {
        // source to target
        result = _converters.from[sourceTypeName][targetTypeName].apply(_converters, arguments);
      } else if (targetTypeName === sourceTypeName || value instanceof targetType) {
        result = value;
      } else if (_converters.to[targetTypeName] && _converters.to[targetTypeName]['default']) {
        // target from anything
        result = _converters.to[targetTypeName]['default'].apply(_converters, arguments);
      } else {
        throw "converter not found";
      }
    } catch (e) {
      _jaydataErrorHandler.Guard.raise(new _jaydataErrorHandler.Exception("Value '" + sourceTypeName + "' not convertable to '" + targetTypeName + "'", 'TypeError', value));
    }

    if (targetType === _initializeJayData2.default.Array && eType && Array.isArray(result)) {
      for (var i = 0; i < result.length; i++) {
        result[i] = this.convertTo.call(this, result[i], eType, undefined, options);
      }
    }

    return result;
  };
  this.registerConverter = function (target, sourceOrToConverters, toConverterOrFromConverters, fromConverter) {
    //registerConverter($data.Guid, { $data.String: fn, int: fn }, { string: fn, int:fn })
    //registerConverter($data.Guid, $data.String, fn, fn);

    var targetName = Container.resolveName(target);
    if (Container.isTypeRegistered(sourceOrToConverters)) {
      //isSource
      _converters.to[targetName] = _converters.to[targetName] || {};
      _converters.from[targetName] = _converters.from[targetName] || {};

      var sourceName = Container.resolveName(sourceOrToConverters);

      if (toConverterOrFromConverters) _converters.to[targetName][sourceName] = toConverterOrFromConverters;
      if (fromConverter) _converters.from[targetName][sourceName] = fromConverter;
    } else {
      // converterGroup

      //fromConverters
      if (_converters.to[targetName]) {
        _converters.to[targetName] = _initializeJayData2.default.typeSystem.extend(_converters.to[targetName], sourceOrToConverters);
      } else {
        _converters.to[targetName] = sourceOrToConverters;
      }

      //toConverters
      if (_converters.from[targetName]) {
        _converters.from[targetName] = _initializeJayData2.default.typeSystem.extend(_converters.from[targetName], toConverterOrFromConverters);
      } else {
        _converters.from[targetName] = toConverterOrFromConverters;
      }
    }
  };

  this.createOrGetNamespace = function (parts, root) {
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (!root[part]) {
        var ns = {};
        ns.__namespace = true;
        root[part] = ns;
      }
      root = root[part];
    }
    return root;
  };
}