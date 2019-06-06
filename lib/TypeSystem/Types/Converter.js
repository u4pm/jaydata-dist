'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_TypeSystem2.default.Container.registerConverter('$data.Boolean', {
    '$data.String': function $dataString(value) {
        if (value.toLowerCase() == 'true') return true;
        if (value.toLowerCase() == 'false') return false;

        return !!value;
    },
    'default': function _default(value) {
        return !!value;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.Integer', {
    'default': function _default(value) {
        if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY || value === Number.MAX_VALUE || value === Number.MIN_VALUE) {
            return value;
        }

        var r = parseInt(+value, 10);
        if (isNaN(r)) throw 0;
        return r;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.Int32', {
    'default': function _default(value) {
        return value | 0;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.Number', {
    'default': function _default(value) {
        var r = +value;
        if (isNaN(r)) throw 0;
        return r;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.Byte', {
    'default': function _default(value) {
        return (value | 0) & 0xff;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.Date', {
    'default': function _default(value) {
        var d = new Date(value);
        if (isNaN(d)) throw 0;
        return d;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.DateTimeOffset', {
    '$data.Date': function $dataDate(value) {
        return value;
    },
    'default': function _default(value) {
        var d = new Date(value);
        if (isNaN(d)) throw 0;
        return d;
    }
});
(function () {
    function parseFromString(value) {
        var regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]|[0-9])(:([0-5][0-9]|[0-9])(\.(\d+))?)?$/;

        var matches = regex.exec(value);
        if (!matches) throw 0;
        var time = '';
        time += ('00' + matches[1]).slice(-2);
        time += ':' + ('00' + matches[2]).slice(-2);
        if (matches[4]) {
            time += ':' + ('00' + matches[4]).slice(-2);
        } else {
            time += ':00';
        }
        if (matches[6]) time += '.' + (matches[6] + '000').slice(0, 3);

        return time;
    }

    _TypeSystem2.default.Container.registerConverter('$data.Time', {
        '$data.String': parseFromString,
        '$data.Number': function tt(value) {
            var metrics = [1000, 60, 60];
            var result = [0, 0, 0, value | 0];

            for (var i = 0; i < metrics.length; i++) {
                result[metrics.length - (i + 1)] = result[metrics.length - i] / metrics[i] | 0;
                result[metrics.length - i] -= result[metrics.length - (i + 1)] * metrics[i];
            }

            var time = '';
            for (var i = 0; i < result.length; i++) {
                if (i < result.length - 1) {
                    time += ('00' + result[i]).slice(-2);
                    if (i < result.length - 2) time += ':';
                } else {
                    time += '.' + ('000' + result[i]).slice(-3);
                }
            }

            return parseFromString(time);
        },
        '$data.Date': function $dataDate(value) {
            var val = value.getHours() + ':' + value.getMinutes() + ':' + value.getSeconds();
            var ms = value.getMilliseconds();
            if (ms) {
                val += '.' + ms;
            }

            return parseFromString(val);
        }
    });
})();
(function () {
    function parseFromString(value) {
        var regex = /^(-?)([0-9]{1,4})-(1[0-2]|0[0-9]|[0-9])-([0-2][0-9]|3[0-1]|[0-9])$/;

        var matches = regex.exec(value);
        if (!matches) throw 0;
        var date = matches[1];
        date += ('0000' + matches[2]).slice(-4);
        date += '-' + ('00' + matches[3]).slice(-2);
        date += '-' + ('00' + matches[4]).slice(-2);
        return date;
    }
    function parseFromDate(value) {
        var val = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
        return parseFromString(val);
    }

    _TypeSystem2.default.Container.registerConverter('$data.Day', {
        '$data.String': parseFromString,
        '$data.Number': function tt(value) {
            var t = 1000 * 60 * 60 * 24;
            var day = value * t;
            if (isNaN(day)) throw 0;

            return parseFromDate(new Date(day));
        },
        '$data.Date': parseFromDate
    });
})();
(function () {
    function parseFromString(value) {
        return value;
    }

    _TypeSystem2.default.Container.registerConverter('$data.Duration', {
        '$data.String': parseFromString
    });
})();
_TypeSystem2.default.Container.registerConverter('$data.Decimal', {
    '$data.Boolean': function $dataBoolean(value) {
        return value ? '1' : '0';
    },
    '$data.Number': function $dataNumber(value) {
        return value.toString();
    },
    '$data.String': function $dataString(value) {
        if (!/^\-?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) throw 0;
        return value;
    },
    '$data.Date': function $dataDate(value) {
        var r = value.valueOf();
        if (isNaN(r)) throw 0;
        return r.toString();
    }
});

_TypeSystem2.default.packIEEE754 = function (v, ebits, fbits) {
    var bias = (1 << ebits - 1) - 1,
        s,
        e,
        f,
        ln,
        i,
        bits,
        str,
        bytes;

    // Compute sign, exponent, fraction
    if (v !== v) {
        // NaN
        // http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping
        e = (1 << bias) - 1;f = Math.pow(2, fbits - 1);s = 0;
    } else if (v === Infinity || v === -Infinity) {
        e = (1 << bias) - 1;f = 0;s = v < 0 ? 1 : 0;
    } else if (v === 0) {
        e = 0;f = 0;s = 1 / v === -Infinity ? 1 : 0;
    } else {
        s = v < 0;
        v = Math.abs(v);

        if (v >= Math.pow(2, 1 - bias)) {
            // Normalized
            ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
            e = ln + bias;
            f = Math.round(v * Math.pow(2, fbits - ln) - Math.pow(2, fbits));
        } else {
            // Denormalized
            e = 0;
            f = Math.round(v / Math.pow(2, 1 - bias - fbits));
        }
    }

    // Pack sign, exponent, fraction
    bits = [];
    for (i = fbits; i; i -= 1) {
        bits.push(f % 2 ? 1 : 0);f = Math.floor(f / 2);
    }
    for (i = ebits; i; i -= 1) {
        bits.push(e % 2 ? 1 : 0);e = Math.floor(e / 2);
    }
    bits.push(s ? 1 : 0);
    bits.reverse();
    str = bits.join('');

    // Bits to bytes
    bytes = [];
    while (str.length) {
        bytes.push(parseInt(str.substring(0, 8), 2));
        str = str.substring(8);
    }

    return bytes;
};

_TypeSystem2.default.unpackIEEE754 = function (bytes, ebits, fbits) {
    // Bytes to bits
    var bits = [],
        i,
        j,
        b,
        str,
        bias,
        s,
        e,
        f;

    for (i = bytes.length; i; i -= 1) {
        b = bytes[i - 1];
        for (j = 8; j; j -= 1) {
            bits.push(b % 2 ? 1 : 0);b = b >> 1;
        }
    }
    bits.reverse();
    str = bits.join('');

    // Unpack sign, exponent, fraction
    bias = (1 << ebits - 1) - 1;
    s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
    e = parseInt(str.substring(1, 1 + ebits), 2);
    f = parseInt(str.substring(1 + ebits), 2);

    // Produce number
    if (e === (1 << ebits) - 1) {
        return f !== 0 ? NaN : s * Infinity;
    } else if (e > 0) {
        // Normalized
        return s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
    } else if (f !== 0) {
        // Denormalized
        return s * Math.pow(2, -(bias - 1)) * (f / Math.pow(2, fbits));
    } else {
        return s < 0 ? -0 : 0;
    }
};

_TypeSystem2.default.IEEE754 = function (v, e, f) {
    return _TypeSystem2.default.unpackIEEE754(_TypeSystem2.default.packIEEE754(v, e, f), e, f);
};

_TypeSystem2.default.Container.registerConverter('$data.Float', {
    'default': function _default(value) {
        var r = +value;
        if (isNaN(r)) throw 0;
        return _TypeSystem2.default.IEEE754(r, 8, 23);
    }
});

_TypeSystem2.default.Container.registerConverter('$data.Int16', {
    'default': function _default(value) {
        var r = (value | 0) & 0xffff;
        if (r >= 0x8000) return r - 0x10000;
        return r;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.Int64', {
    '$data.Boolean': function $dataBoolean(value) {
        return value ? '1' : '0';
    },
    '$data.Number': function $dataNumber(value) {
        var r = value.toString();
        if (r.indexOf('.') > 0) return r.split('.')[0];
        if (r.indexOf('.') == 0) throw 0;
        return r;
    },
    '$data.String': function $dataString(value) {
        if (!/^\-?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) throw 0;
        if (value.indexOf('.') > 0) return value.split('.')[0];
        if (value.indexOf('.') == 0) throw 0;
        return value;
    },
    '$data.Date': function $dataDate(value) {
        var r = value.valueOf();
        if (isNaN(r)) throw 0;
        return r.toString();
    }
});

_TypeSystem2.default.Container.registerConverter('$data.SByte', {
    'default': function _default(value) {
        var r = (value | 0) & 0xff;
        if (r >= 0x80) return r - 0x100;
        return r;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.String', {
    '$data.Date': function $dataDate(value) {
        return value.toISOString();
    },
    '$data.ObjectID': function $dataObjectID(value) {
        return btoa(value.toString());
    },
    'default': function _default(value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') return JSON.stringify(value);
        return value.toString();
    }
});

_TypeSystem2.default.Container.registerConverter('$data.Object', {
    '$data.String': function $dataString(value) {
        return JSON.parse(value);
    },
    '$data.Function': function $dataFunction() {
        throw 0;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.Array', {
    '$data.String': function $dataString(value) {
        var r = JSON.parse(value);
        if (!Array.isArray(r)) throw 0;
        return r;
    }
});

_TypeSystem2.default.Container.registerConverter('$data.ObjectID', {
    '$data.ObjectID': function $dataObjectID(value) {
        try {
            return btoa(value.toString());
        } catch (e) {
            return value;
        }
    },
    '$data.String': function $dataString(id) {
        return id;
    }
});

_TypeSystem2.default.Container.proxyConverter = function (v) {
    return v;
};
_TypeSystem2.default.Container.defaultConverter = function (type) {
    return function (v) {
        return _TypeSystem2.default.Container.convertTo(v, type);
    };
};

exports.default = _TypeSystem2.default;
module.exports = exports['default'];