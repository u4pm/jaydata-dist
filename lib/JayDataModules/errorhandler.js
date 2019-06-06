'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _core = require('../../core.js');

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