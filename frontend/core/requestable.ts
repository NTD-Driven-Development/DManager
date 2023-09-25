import { WatchStopHandle } from 'vue';

export abstract class Requestable<T> {
    private _state = ref(RequestState.Pendding);
    state = readonly(this._state);

    protected tryRequest(): void {
        this._state.value = RequestState.Loadding;
        try {
            this.define()
            .then((fulfilled) => {
                this.onFulfilled(fulfilled);
            })
            .catch((rejected) => {
                this.onRejected(rejected);
            })
        }
        catch (error) {
            throw error;
        }
    }

    // SSR模式下不可使用
    async wait(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let unwatch!: WatchStopHandle;
            let signal = false;

            if (this._state.value == RequestState.Error) {
                reject();
            }
            if (this._state.value == RequestState.Loaded) {
                resolve();
            }

            unwatch = watchEffect(() => {
                if (this._state.value == RequestState.Error && signal) {
                    unwatch && unwatch();
                    reject();
                }
                if (this._state.value == RequestState.Loaded && signal) {
                    unwatch && unwatch();
                    resolve();
                }
                else {
                    signal = true;
                }
            });
        });
    }

    async intervalWait(ms: number = 50): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let timer: NodeJS.Timer;

            if (this.state.value == RequestState.Error) {
                reject();
            }
            if (this.state.value == RequestState.Loaded) {
                resolve();
            }

            timer = setInterval(() => {
                if (this.state.value == RequestState.Error) {
                    timer && clearInterval(timer);
                    reject();
                }
                if (this.state.value == RequestState.Loaded) {
                    timer && clearInterval(timer);
                    resolve();
                }
            }, ms);
        });
    }

    protected abstract define(): Promise<T>;

    protected onFulfilled(fulfill: T): void {
        this._state.value = RequestState.Loaded;
    }

    protected onRejected(reject: any): void {
        this._state.value = RequestState.Error;
    }
}

export enum RequestState {
    Pendding,
    Loadding,
    Loaded,
    Error,
}