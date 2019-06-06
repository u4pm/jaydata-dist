// JayData 1.5.13 
// Dual licensed under MIT and GPL v2
// Copyright JayStack Technologies (http://jaydata.org/licensing)
//
// JayData is a standards-based, cross-platform Javascript library and a set of
// practices to access and manipulate data from various online and offline sources.
//
// Credits:
//     Hajnalka Battancs, Dániel József, János Roden, László Horváth, Péter Nochta
//     Péter Zentai, Róbert Bónay, Szabolcs Czinege, Viktor Borza, Viktor Lázár,
//     Zoltán Gyebrovszki, Gábor Dolla
//
// More info: http://jaydata.org
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define("jaydata/modules/inmemory",["jaydata/core"],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.$data = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = _dereq_("jaydata/core");

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($data) {

    $data.Array.prototype.toQueryable = function () {
        if (this.length > 0) {
            var firtsItem = this[0];
            var type = _core.Container.resolveType(_core.Container.getTypeName(firtsItem));

            if (!type.isAssignableTo || !type.isAssignableTo($data.Entity)) _core.Guard.raise(new _core.Exception("Type '" + _core.Container.resolveName(type) + "' is not subclass of $data.Entity", "Not supported", type));

            for (var i = 0; i < this.length; i++) {
                _core.Guard.requireType('array item check', this[i], type);
            }
        }

        var typeName = 'inMemoryArray_' + type.name;
        if (!_core.Container.isTypeRegistered(typeName)) {
            $data.EntityContext.extend(typeName, {
                Source: {
                    type: $data.EntitySet,
                    elementType: type
                }
            });
        }

        var context = _core.Container['create' + typeName]({ name: 'InMemory', source: { Source: this } });

        return context.Source;
    };
})(_core2.default);

exports.default = _core2.default;
module.exports = exports['default'];

},{"jaydata/core":"jaydata/core"}]},{},[1])(1)
});

