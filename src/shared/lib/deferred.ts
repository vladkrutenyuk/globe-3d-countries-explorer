export class Deferred<TData, TParams = void> {
    private _prms: Promise<TData> | null = null;
    private _fn: (params: TParams) => Promise<TData>;

    constructor(loadAsyncFn: (params: TParams) => Promise<TData>) {
        this._fn = loadAsyncFn;
    }

    async getAsync(params: TParams): Promise<TData> {
        if (!this._prms) {
            this._prms = this._fn(params);
        }
        return await this._prms;
    }
}
