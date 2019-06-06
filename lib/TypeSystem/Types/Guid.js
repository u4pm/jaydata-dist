'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_TypeSystem2.default.Guid = function Guid(value) {
    ///<param name="value" type="string" />

    if (value === undefined || typeof value === 'string' && /^[a-zA-z0-9]{8}-[a-zA-z0-9]{4}-[a-zA-z0-9]{4}-[a-zA-z0-9]{4}-[a-zA-z0-9]{12}$/.test(value)) {
        this.value = value || '00000000-0000-0000-0000-000000000000';
    } else {
        throw Guard.raise(new Exception('TypeError: ', 'value not convertable to $data.Guid', value));
    }
};
_TypeSystem2.default.Container.registerType(['$data.Guid', 'Guid', 'guid'], _TypeSystem2.default.Guid);
_TypeSystem2.default.Container.registerConverter('$data.Guid', {
    '$data.String': function $dataString(value) {
        return value ? _TypeSystem2.default.parseGuid(value).toString() : value;
    },
    '$data.Guid': function $dataGuid(value) {
        return value ? value.toString() : value;
    }
}, {
    '$data.String': function $dataString(value) {
        return value ? value.toString() : value;
    }
});

_TypeSystem2.default.Guid.prototype.toJSON = function () {
    return this.value;
};

_TypeSystem2.default.Guid.prototype.valueOf = function () {
    return this.value;
};

_TypeSystem2.default.Guid.prototype.toString = function () {
    return this.value;
};

_TypeSystem2.default.Guid.NewGuid = function () {
    return _TypeSystem2.default.createGuid();
};

_TypeSystem2.default.parseGuid = function (guid) {
    return new _TypeSystem2.default.Guid(guid);
};

(function () {
    /*!
    Math.uuid.js (v1.4)
    http://www.broofa.com
    mailto:robert@broofa.com
      Copyright (c) 2010 Robert Kieffer
    Dual licensed under the MIT and GPL licenses.
    */

    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    _TypeSystem2.default.createGuid = function (guidString) {
        if (guidString) {
            return new _TypeSystem2.default.Guid(guidString);
        };

        var len;
        var chars = CHARS,
            uuid = [],
            i;
        var radix = chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) {
                uuid[i] = chars[0 | Math.random() * radix];
            }
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
                }
            }
        }

        return _TypeSystem2.default.parseGuid(uuid.join(''));
    };
})();

exports.default = _TypeSystem2.default;
module.exports = exports['default'];