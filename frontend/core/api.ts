import { UnwrapRef, WatchOptions } from 'vue';
import { AxiosResponse } from 'axios';
import { Filter } from "./filter";
import { Requestable } from './requestable';
import _ from 'lodash';

export abstract class AxiosRequestable<T> extends Requestable<AxiosResponse<T>> implements AxiosResponseEventOptions<T> {
    protected _successCbs: ((data: T) => void)[] = [];
    protected _errorCbs: ((error: any) => void)[] = [];
    protected _response = ref<AxiosResponse<T>>();

    protected tryRequest(): void {
        super.tryRequest();
    }

    protected onFulfilled(fulfill: AxiosResponse<T, any>): void {
        this._response.value = fulfill;
        this._successCbs.length && this._successCbs.forEach((it) => it(fulfill.data));
        super.onFulfilled(fulfill);
    }

    protected onRejected(reject: any): void {
        super.onRejected(reject);
        this._errorCbs.length && this._errorCbs.forEach((it) => it(reject));
    }

    success(callback: (response: T) => void): this {
        this._successCbs.push(callback);
        return this;
    }

    error(callback: (error: any) => void): this {
        this._errorCbs.push(callback);
        return this;
    }
}

export abstract class ApiRequestable<T, Q extends Queries = Queries> extends AxiosRequestable<ApiResponse<T>> {
    protected _queries = ref<Q>({} as Q);
    queries = readonly(this._queries);
    options = _.cloneDeep(defaultOptions);

    protected setQuery<K extends keyof UnwrapRef<Q>, V extends UnwrapRef<Q>[K]>(key: K, value: V): void {
        const copyQueries = _.cloneDeep(this._queries.value);

        if (_.isEqual(copyQueries[key], value)) return;
        if (_.isEmpty(_.toString(copyQueries[key] ?? '')) && _.isEmpty(_.toString(value ?? ''))) return;

        copyQueries[key] = value! ?? undefined;

        this._queries.value = copyQueries;
    }

    withQuery = <K extends keyof Q, V extends Q[K]>(key: K, value: V) => {};

    withQueries = <K extends keyof Q, V extends Q[K]>(queries: Record<K, V>) => {
        _.map(queries, (v, k) => {
            this.withQuery(k as K, v);
        });
    };

    bind = <K extends keyof Q, V extends Q[K]>(queryKey: K, ref: Ref<V>, options?: WatchOptions) => {
        const stopHandler = watch(() => ref.value, (n, o) => {
            this.withQuery(queryKey, n);
        }, options);

        return stopHandler;
    }

    bindWith = <T, K extends keyof Q, V extends Q[K]>(queryKey: K, ref: Ref<T>, transformer: (v: T) => V, options?: WatchOptions) => {
        const stopHandler = watch(() => ref.value, (n, o) => {
            this.withQuery(queryKey, transformer(n));
        }, options);

        return stopHandler;
    }

    bindFilter = <T, K extends keyof Q, V extends Q[K]>(queryKey: K, filter: Filter<T>, transformer: (items: T[]) => V, options?: WatchOptions) => {
        const stopHandler = watch(() => filter.filterItems.value, (n, o) => {
            this.withQuery(queryKey, transformer(n));
        }, options);

        return stopHandler;
    }
}

export abstract class ApiCaller<T = any, Q extends Queries = Queries> extends ApiRequestable<T, Q> {
    protected _data = ref<T>();
    data = shallowReadonly(this._data);

    constructor(options?: Options) {
        super();

        this.options = _.defaultsDeep(options, this.options);
    }

    protected startQueriesWatcher() {
        const stopHandler = watch(() => this.queries.value, _.debounce((n, o) => {
            if (!this.options.autoReload) return;

            this.tryRequest();
        }, this.options.debounceTime), { immediate: this.options.immediate, deep: true });

        return stopHandler;
    }

    protected onFulfilled(fulfill: AxiosResponse<ApiResponse<T>, any>): void {
        this._data.value = fulfill.data.data;
        super.onFulfilled(fulfill);
    }

    reload = () => this.tryRequest();
    
    clear = () => this._data.value = undefined;
}

export abstract class ApiPaginator<T = any, Q extends PaginationQueries = PaginationQueries> 
extends ApiRequestable<PaginationResponse<T>, Q> {
    protected _data = ref<T[]>();
    data = shallowReadonly(this._data);
    paginate = ref<PaginationState>({} as PaginationState);

    constructor(options?: Options) {
        super();

        this.options = _.defaultsDeep(options, this.options);
    }

    protected startQueriesWatcher() {
        const stopHandler = watch(() => this.queries.value, _.debounce((n, o) => {
            if (!this.options.autoReload) return;

            this.tryRequest();
        }, this.options.debounceTime), { immediate: this.options.immediate, deep: true });

        return stopHandler;
    }

    protected onFulfilled(fulfill: AxiosResponse<ApiResponse<PaginationResponse<T>>, any>): void {
        this._data.value = fulfill.data.data?.items;
        this.paginate.value.currentPage = fulfill.data.data?.current_page!;
        this.paginate.value.lastPage = fulfill.data.data?.last_page!;
        super.onFulfilled(fulfill);
    }

    prev = (n: number = 1): void => {
        const paginate = this.paginate.value;
        this._queries.value.offset = paginate.currentPage - n > 1? paginate.currentPage - n : 1;
    }

    next = (n: number = 1): void => {
        const paginate = this.paginate.value;
        this._queries.value.offset = paginate.currentPage + n <= paginate.lastPage ? paginate.currentPage + n : paginate.lastPage;
    }

    first = () => {
        this._queries.value.offset = 1;
    }

    last = () => {
        const paginate = this.paginate.value;
        this._queries.value.offset = paginate.lastPage;
    }

    canPrev = (n: number = 1): boolean => this.paginate.value.currentPage - n > 0;
    
    canNext = (n: number = 1): boolean => this.paginate.value.currentPage + n <= this.paginate.value.lastPage;

    reload = () => this.tryRequest();

    clear = () => this._data.value = undefined;
}

export interface ApiResponse<T> {
    data?: T,
    error?: string,
    statusCode: number,
}

export interface PaginationResponse<T> {
    from: number,
    to: number,
    total: number,
    per_page: number,
    current_page: number,
    last_page: number,
    items: T[],
}

export interface AxiosResponseEventOptions<T> {
    success(callback: (response: T) => void): this,
    error(callback: (error: any) => void): this,
}

export type Queries = object;

export interface PaginationQueries extends Queries {
    limit: number,
    offset: number,
}

export interface PaginationState {
    from: number,
    to: number,
    total: number,
    perPage: number,
    currentPage: number,
    lastPage: number,
}

export interface Options {
    immediate?: boolean,
    debounceTime?: number,
    autoReload?: boolean,
}

const defaultOptions: Options = {
    immediate: true,
    debounceTime: 100,
    autoReload: true,
}