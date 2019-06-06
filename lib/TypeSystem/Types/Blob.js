'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

var _jaydataErrorHandler = require('jaydata-error-handler');

var _btoa = require('btoa');

var _btoa2 = _interopRequireDefault(_btoa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bufferOrArray = eval('typeof Buf' + 'fer !== "undefined" ? Buf' + 'fer : Uint8Array');
_TypeSystem2.default.Blob = function Blob() {};

_TypeSystem2.default.Blob.createFromHexString = function (value) {
    if (value != value.match(new RegExp('[0-9a-fA-F]+'))[0]) {
        _jaydataErrorHandler.Guard.raise(new _jaydataErrorHandler.Exception('TypeError: ', 'value not convertable to $data.Blob', value));
    } else {
        //if (value.length & 1) value = '0' + value;
        var arr = new bufferOrArray(value.length >> 1);
        for (var i = 0, j = 1, k = 0; i < value.length; i += 2, j += 2, k++) {
            arr[k] = parseInt('0x' + value[i] + value[j], 16);
        }

        return arr;
    }
};

_TypeSystem2.default.Blob.toString = function (value) {
    if (!value || !value.length) return null;
    var s = '';
    for (var i = 0; i < value.length; i++) {
        s += String.fromCharCode(value[i]);
    }

    return s;
};

_TypeSystem2.default.Blob.toBase64 = function (value) {
    if (!value || !value.length) return null;
    return (0, _btoa2.default)(_TypeSystem2.default.Blob.toString(value));
};

_TypeSystem2.default.Blob.toArray = function (src) {
    if (!src || !src.length) return null;
    var arr = new Array(src.length);
    for (var i = 0; i < src.length; i++) {
        arr[i] = src[i];
    }

    return arr;
};

/*$data.Blob.toJSON = function(value){
    return JSON.stringify($data.Blob.toArray(value));
};*/

_TypeSystem2.default.Blob.toHexString = function (value) {
    if (!value || !value.length) return null;
    var s = '';
    for (var i = 0; i < value.length; i++) {
        s += ('00' + value[i].toString(16)).slice(-2);
    }

    return s.toUpperCase();
};

_TypeSystem2.default.Blob.toDataURL = function (value) {
    if (!value || !value.length) return null;
    return 'data:application/octet-stream;base64,' + (0, _btoa2.default)(_TypeSystem2.default.Blob.toString(value));
};

_TypeSystem2.default.Container.registerType(["$data.Blob", "blob", "JayBlob"], _TypeSystem2.default.Blob);
_TypeSystem2.default.Container.registerConverter('$data.Blob', {
    '$data.String': function $dataString(value) {
        if (value && value.length) {
            var blob = new bufferOrArray(value.length);
            for (var i = 0; i < value.length; i++) {
                blob[i] = value.charCodeAt(i);
            }

            return blob;
        } else return null;
    },
    '$data.Array': function $dataArray(value) {
        return new bufferOrArray(value);
    },
    '$data.Number': function $dataNumber(value) {
        return new bufferOrArray(_TypeSystem2.default.packIEEE754(value, 11, 52).reverse());
    },
    '$data.Boolean': function $dataBoolean(value) {
        return new bufferOrArray([value | 0]);
    },
    'default': function _default(value) {
        if (typeof Blob !== 'undefined' && value instanceof Blob) {
            var req = new XMLHttpRequest();
            req.open('GET', URL.createObjectURL(value), false);
            req.send(null);
            return _TypeSystem2.default.Container.convertTo(req.response, _TypeSystem2.default.Blob);
        } else if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
            return new bufferOrArray(new Uint8Array(value));
        } else if (value instanceof Uint8Array) {
            //if (typeof Buffer !== 'undefined') return new Buffer(value);
            //else
            return value;
        } else /*if (typeof Buffer !== 'undefined' ? value instanceof Buffer : false){
               return value;
               }else*/if (value.buffer) {
                return new bufferOrArray(value);
            } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && value instanceof Object) {
                var arr = [];
                for (var i in value) {
                    arr[i] = value[i];
                }
                if (!arr.length) throw 0;
                return new bufferOrArray(arr);
            }
        throw 0;
    }
}, {
    '$data.String': function $dataString(value) {
        return _TypeSystem2.default.Blob.toString(value);
    },
    '$data.Array': function $dataArray(value) {
        return _TypeSystem2.default.Blob.toArray(value);
    }
});