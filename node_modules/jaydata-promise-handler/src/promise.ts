import * as extend from 'extend';
import { IPromise, CallbackSettings, PromiseHandlerBase, PromiseNotImplemented } from './promiseHandlerBase';

export class PromiseHandler extends PromiseHandlerBase{
	private resolve:Function
	private reject:Function
	private deferred:any
	constructor(){
		super();

		var self = this;
		var promise:Promise<any> = new Promise<any>(function(resolve, reject){
			self.resolve = resolve;
			self.reject = reject;
		});

		this.deferred = {
			resolve: function(){ self.resolve.apply(promise, arguments); },
			reject: function(){ self.reject.apply(promise, arguments); },
			promise: promise
		};
	}
	createCallback(callback:Function):CallbackSettings {
		var settings:CallbackSettings = PromiseHandlerBase.createCallbackSettings(callback);
		var self = this;

		var result:CallbackSettings = new CallbackSettings();
		result = extend(result, {
            success: function () {
                settings.success.apply(self.deferred, arguments);
                self.resolve.apply(self.deferred, arguments);
            },
            error: function () {
                Array.prototype.push.call(arguments, self.deferred);
                settings.error.apply(self.deferred, arguments);
            },
            notify: function () {
                settings.notify.apply(self.deferred, arguments);
            }
        });

		return result;
	}
	getPromise():IPromise{
		return this.deferred.promise;
	}
	static compatibilityMode(){
		Promise.prototype['fail'] = function(onReject){
			return this.then(null, function(reason){
				onReject(reason);
				throw reason;
			});
		};

		Promise.prototype['always'] = function(onResolveOrReject) {
			return this.then(onResolveOrReject, function(reason) {
				onResolveOrReject(reason);
				throw reason;
			});
		};
	}
	static use($data:any){
		$data.PromiseHandler = typeof Promise == 'function' ? PromiseHandler : PromiseHandlerBase;
		$data.PromiseHandlerBase = PromiseHandlerBase;
		$data.Promise = PromiseNotImplemented;
	}
}
