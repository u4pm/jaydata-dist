'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var strategy = {
    name: 'empty',
    condition: function condition(provider, convertedItems) {
        return true;
    },
    save: function save(provider, convertedItems, callBack) {
        callBack.success(0);
    }
};

exports.strategy = strategy;