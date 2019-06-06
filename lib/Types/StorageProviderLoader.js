'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.StorageProviderLoaderBase', null, null, {
    isSupported: function isSupported(providerName) {
        _index2.default.Trace.log('Detecting ' + providerName + ' provider support');
        var supported = true;
        switch (providerName) {
            case 'indexedDb':
                supported = _index2.default.__global.indexedDB || _index2.default.__global.webkitIndexedDB || _index2.default.__global.mozIndexedDB || _index2.default.__global.msIndexedDB && !/^file:/.test(_index2.default.__global.location && _index2.default.__global.location.href);
                break;
            case 'storm':
                supported = 'XMLHttpRequest' in _index2.default.__global;
                break;
            case 'webSql':
            case 'sqLite':
                supported = 'openDatabase' in _index2.default.__global;
                break;
            case 'LocalStore':
                supported = 'localStorage' in _index2.default.__global && _index2.default.__global.localStorage ? true : false;
                break;
            case 'sqLite':
                supported = 'openDatabase' in _index2.default.__global;
                break;
            case 'mongoDB':
                supported = _index2.default.mongoDBDriver;
                break;
            default:
                break;
        }
        _index2.default.Trace.log(providerName + ' provider is ' + (supported ? '' : 'not') + ' supported');
        return supported;
    },
    scriptLoadTimeout: { type: 'int', value: 1000 },
    scriptLoadInterval: { type: 'int', value: 50 },
    npmModules: {
        value: {
            'indexedDb': 'jaydata-indexeddb',
            'InMemory': 'jaydata-inmemory',
            'LocalStore': 'jaydata-inmemory',
            'mongoDB': 'jaydata-mongodb',
            'oData': 'jaydata-odata',
            'webApi': 'jaydata-webapi',
            'sqLite': 'jaydata-sqlite',
            'webSql': 'jaydata-sqlite',
            'storm': 'jaydata-storm'
        }
    },
    ProviderNames: {
        value: {
            'indexedDb': 'IndexedDb',
            'InMemory': 'InMemory',
            'LocalStore': 'InMemory',
            'oData': 'oData',
            'webApi': 'WebApi',
            'sqLite': 'SqLite',
            'webSql': 'SqLite',
            'storm': 'Storm'
        }
    },
    load: function load(providerList, callback) {
        _index2.default.RegisteredStorageProviders = _index2.default.RegisteredStorageProviders || {};

        _index2.default.Trace.log('Loading provider(s): ' + providerList);
        callback = _index2.default.PromiseHandlerBase.createCallbackSettings(callback);

        var self = this;
        var cacheKey = providerList.join(',');
        self._fallbackCache = self._fallbackCache || {};

        if (self._fallbackCache[cacheKey]) {
            callback.success(self._fallbackCache[cacheKey]);
        } else {
            this.find(providerList, {
                success: function success(provider, selectedProvider) {
                    self._fallbackCache[cacheKey] = provider;
                    callback.success.call(this, provider);
                },
                error: callback.error
            });
        }
    },
    find: function find(providerList, callback) {
        var currentProvider = providerList.shift();
        var currentProvider = this.getVirtual(currentProvider);
        if (Array.isArray(currentProvider)) {
            providerList = currentProvider;
            currentProvider = providerList.shift();
        }

        while (currentProvider && !this.isSupported(currentProvider)) {
            currentProvider = providerList.shift();
        }

        _index2.default.Trace.log('First supported provider is ' + currentProvider);

        if (!currentProvider) {
            _index2.default.Trace.log('Provider fallback failed');
            callback.error();
        }

        if (_index2.default.RegisteredStorageProviders) {
            _index2.default.Trace.log('Is the ' + currentProvider + ' provider already registered?');
            var provider = _index2.default.RegisteredStorageProviders[currentProvider];
            if (provider) {
                _index2.default.Trace.log(currentProvider + ' provider registered');
                callback.success(provider);
                return;
            } else {
                _index2.default.Trace.log(currentProvider + ' provider not registered');
            }
        }

        if (!process.browser) {
            // NodeJS
            _index2.default.Trace.log('node.js detected trying to load NPM module');
            this.loadNpmModule(currentProvider, providerList, callback);
        } else {
            _index2.default.Trace.log('Browser detected trying to load provider');
            this.loadProvider(currentProvider, providerList, callback);
        }
    },
    loadProvider: function loadProvider(currentProvider, providerList, callback) {
        var self = this;
        var mappedName = _index2.default.StorageProviderLoader.ProviderNames[currentProvider] || currentProvider;
        _index2.default.Trace.log(currentProvider + ' provider is mapped to name ' + mappedName + 'Provider');
        if (mappedName) {
            var url = this.getUrl(mappedName);
            _index2.default.Trace.log(currentProvider + ' provider from URL: ' + url);

            var loader = this.loadScript;
            if (document && document.createElement) {
                _index2.default.Trace.log('document and document.createElement detected, using script element loader method');
                loader = this.loadScriptElement;
            }

            loader.call(this, url, currentProvider, function (successful) {
                var provider = _index2.default.RegisteredStorageProviders[currentProvider];
                if (successful && provider) {
                    _index2.default.Trace.log(currentProvider + ' provider successfully registered');
                    callback.success(provider);
                } else if (providerList.length > 0) {
                    _index2.default.Trace.log(currentProvider + ' provider failed to load, trying to fallback to ' + providerList + ' provider(s)');
                    self.find(providerList, callback);
                } else {
                    _index2.default.Trace.log(currentProvider + ' provider failed to load');
                    callback.error();
                }
            });
        }
    },
    getUrl: function getUrl(providerName) {
        var jaydataScriptMin = document.querySelector('script[src$="jaydata.min.js"]');
        var jaydataScript = document.querySelector('script[src$="jaydata.js"]');
        if (jaydataScriptMin) return jaydataScriptMin.src.substring(0, jaydataScriptMin.src.lastIndexOf('/') + 1) + 'jaydataproviders/' + providerName + 'Provider.min.js';else if (jaydataScript) return jaydataScript.src.substring(0, jaydataScript.src.lastIndexOf('/') + 1) + 'jaydataproviders/' + providerName + 'Provider.js';else return 'jaydataproviders/' + providerName + 'Provider.js';
    },
    loadScript: function loadScript(url, currentProvider, callback) {
        if (!url) {
            callback(false);
            return;
        }

        function getHttpRequest() {
            if (_index2.default.__global.XMLHttpRequest) return new XMLHttpRequest();else if (_index2.default.__global.ActiveXObject !== undefined) return new ActiveXObject("MsXml2.XmlHttp");else {
                _index2.default.Trace.log('XMLHttpRequest or MsXml2.XmlHttp ActiveXObject not found');
                callback(false);
                return;
            }
        }

        var oXmlHttp = getHttpRequest();
        oXmlHttp.onreadystatechange = function () {
            _index2.default.Trace.log('HTTP request is in state: ' + oXmlHttp.readyState);
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200 || oXmlHttp.status == 304) {
                    _index2.default.Trace.log('HTTP request succeeded');
                    _index2.default.Trace.log('HTTP request response text: ' + oXmlHttp.responseText);
                    eval.call(_index2.default.__global, oXmlHttp.responseText);
                    if (typeof callback === 'function') callback(true);else _index2.default.Trace.log('Callback function is undefined');
                } else {
                    _index2.default.Trace.log('HTTP request status: ', oXmlHttp.status);
                    if (typeof callback === 'function') callback(false);else _index2.default.Trace.log('Callback function is undefined');
                }
            }
        };
        oXmlHttp.open('GET', url, true);
        oXmlHttp.send(null);
    },
    loadScriptElement: function loadScriptElement(url, currentProvider, callback) {
        var head = document.getElementsByTagName('head')[0] || document.documentElement;

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        _index2.default.Trace.log('Appending child ' + script + ' to ' + head);
        head.appendChild(script);

        var loadInterval = this.scriptLoadInterval || 50;
        var iteration = Math.ceil(this.scriptLoadTimeout / loadInterval);
        _index2.default.Trace.log('Script element watcher iterating ' + iteration + ' times');
        function watcher() {
            _index2.default.Trace.log('Script element watcher iteration ' + iteration);
            var provider = _index2.default.RegisteredStorageProviders[currentProvider];
            if (provider) {
                _index2.default.Trace.log(currentProvider + ' provider registered');
                callback(true);
            } else {
                iteration--;
                if (iteration > 0) {
                    _index2.default.Trace.log('Script element watcher next iteration');
                    setTimeout(watcher, loadInterval);
                } else {
                    _index2.default.Trace.log('Script element loader failed');
                    callback(false);
                }
            }
        }
        setTimeout(watcher, loadInterval);
    },

    loadNpmModule: function loadNpmModule(currentProvider, providerList, callback) {
        var provider = null;
        try {
            global["require"](this.npmModules[currentProvider]);
            provider = _index2.default.RegisteredStorageProviders[currentProvider];
            _index2.default.Trace.log('NPM module loader successfully registered ' + currentProvider + ' provider');
        } catch (e) {
            _index2.default.Trace.log('NPM module loader failed for ' + currentProvider + ' provider');
        }

        if (provider) {
            callback.success(provider);
        } else if (providerList.length > 0) {
            this.find(providerList, callback);
        } else {
            callback.error();
        }
    },

    virtualProviders: {
        type: _index2.default.Array,
        value: {
            local: {
                fallbacks: ['webSql', 'indexedDb', 'LocalStore']
            }
        }
    },
    getVirtual: function getVirtual(name) {
        if (this.virtualProviders[name]) return [].concat(this.virtualProviders[name].fallbacks);

        return name;
    }
});

_index2.default.StorageProviderLoader = new _index2.default.StorageProviderLoaderBase();

exports.default = _index2.default;
module.exports = exports['default'];