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
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define("jaydata/modules/errorhandler",["jaydata/core"],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.$data = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _core = _dereq_('jaydata/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
	_core2.default.__global.onerror = function (msg, url, line) {
		alert('Error' + (line ? ' in line ' + line : '') + '\n' + (url || '') + '\n' + msg);
	};

	/*$data.__global.onerror = function(msg, url, line){
 	var html = '<div class="error"><span class="url">{url}</span><p class="msg">{msg}</p><span class="line">{line}</span></div>';
 	html = html.replace('{url}', url || '');
 	html = html.replace('{msg}', msg || '');
 	html = html.replace('{line}', line || '');
 
 	var container = document.querySelector ? document.querySelector('.jaydata-errorhandler') : document.getElementsByClassName('jaydata-errorhandler')[0];
 	if (!container){
 		container = document.createElement('DIV');
 		container.innerHTML = '';
 		container.className = 'jaydata-errorhandler';
 		document.body.appendChild(container);
 	}
 
 	container.innerHTML += html;
 };*/
})();

exports.default = _core2.default;
module.exports = exports['default'];

},{"jaydata/core":"jaydata/core"}]},{},[1])(1)
});

