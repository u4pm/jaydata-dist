import { IPromise, CallbackSettings, PromiseHandlerBase } from './promiseHandlerBase';
export declare class PromiseHandler extends PromiseHandlerBase {
    private resolve;
    private reject;
    private deferred;
    constructor();
    createCallback(callback: Function): CallbackSettings;
    getPromise(): IPromise;
    static compatibilityMode(): void;
    static use($data: any): void;
}
