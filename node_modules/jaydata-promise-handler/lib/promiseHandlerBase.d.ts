export interface IPromise {
    always: Function;
    done: Function;
    fail: Function;
    isRejected: Function;
    isResolved: Function;
    pipe: Function;
    progress: Function;
    promise: Function;
    state: Function;
    then: Function;
}
export declare class CallbackSettings {
    success: Function;
    error: Function;
    notify: Function;
}
export declare class PromiseNotImplemented {
    always(): void;
    done(): void;
    fail(): void;
    isRejected(): void;
    isResolved(): void;
    pipe(): void;
    progress(): void;
    promise(): void;
    state(): void;
    then(): void;
}
export declare class PromiseHandlerBase {
    constructor();
    static defaultSuccessCallback(): void;
    static defaultNotifyCallback(): void;
    static defaultErrorCallback(): void;
    static createCallbackSettings(callback: Function, defaultSettings?: any): CallbackSettings;
    createCallback(callback: Function): CallbackSettings;
    getPromise(): IPromise;
}
