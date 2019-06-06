import * as extend from 'extend';
import { Guard, Exception } from 'jaydata-error-handler';

export interface IPromise{
	always:Function
	done:Function
	fail:Function
	isRejected:Function
	isResolved:Function
	pipe:Function
	progress:Function
	promise:Function
	state:Function
	then:Function
}

export class CallbackSettings{
	success:Function
	error:Function
	notify:Function
}

export class PromiseNotImplemented{
	always() { Guard.raise(new Exception('$data.Promise.always', 'Not implemented!')); }
    done() { Guard.raise(new Exception('$data.Promise.done', 'Not implemented!')); }
    fail() { Guard.raise(new Exception('$data.Promise.fail', 'Not implemented!')); }
    isRejected() { Guard.raise(new Exception('$data.Promise.isRejected', 'Not implemented!')); }
    isResolved() { Guard.raise(new Exception('$data.Promise.isResolved', 'Not implemented!')); }
    //notify() { Guard.raise(new Exception('$data.Promise.notify', 'Not implemented!')); }
    //notifyWith() { Guard.raise(new Exception('$data.Promise.notifyWith', 'Not implemented!')); }
    pipe() { Guard.raise(new Exception('$data.Promise.pipe', 'Not implemented!')); }
    progress() { Guard.raise(new Exception('$data.Promise.progress', 'Not implemented!')); }
    promise() { Guard.raise(new Exception('$data.Promise.promise', 'Not implemented!')); }
    //reject() { Guard.raise(new Exception('$data.Promise.reject', 'Not implemented!')); }
    //rejectWith() { Guard.raise(new Exception('$data.Promise.rejectWith', 'Not implemented!')); }
    //resolve() { Guard.raise(new Exception('$data.Promise.resolve', 'Not implemented!')); }
    //resolveWith() { Guard.raise(new Exception('$data.Promise.resolveWith', 'Not implemented!')); }
    state() { Guard.raise(new Exception('$data.Promise.state', 'Not implemented!')); }
    then() { Guard.raise(new Exception('$data.Promise.then', 'Not implemented!')); }
}

export class PromiseHandlerBase{
	constructor(){}
	static defaultSuccessCallback(){}
	static defaultNotifyCallback(){}
	static defaultErrorCallback(){
		if (arguments.length > 0 && arguments[arguments.length - 1] && typeof arguments[arguments.length - 1].reject === 'function'){
			arguments[arguments.length - 1].reject.apply(arguments[arguments.length - 1], arguments);
		}else{
			if (arguments[0] instanceof Error){
				console.error(arguments[0]);
			}else{
				console.error("DefaultError:", "DEFAULT ERROR CALLBACK!", arguments);
			}
		}
	}
	static createCallbackSettings(callback:Function, defaultSettings?:any):CallbackSettings {
		var settings:CallbackSettings = defaultSettings || {
			success: PromiseHandlerBase.defaultSuccessCallback,
			error: PromiseHandlerBase.defaultErrorCallback,
			notify: PromiseHandlerBase.defaultNotifyCallback
		};

		var result:CallbackSettings = new CallbackSettings();
		if (callback == null || callback == undefined){
			result = settings;
		}else if (typeof callback == 'function'){
			result = extend(settings, {
				success: callback
			});
		}else{
			result = extend(settings, callback);
		}

		var wrapCode:Function = function(fn:Function){
			var t = this;

			function r(){
				fn.apply(t, arguments);
				fn = function(){};
			}

			return r;
		}

		if (typeof result.error === 'function') result.error = wrapCode(result.error);

		return result;
	}
	createCallback(callback:Function):CallbackSettings {
		return PromiseHandlerBase.createCallbackSettings(callback);
	}
	getPromise():IPromise{
		return new PromiseNotImplemented();
	}
}
