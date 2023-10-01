import axios, { AxiosResponse } from 'axios';
import { ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/logs';

export class LogPaginator extends ApiPaginator<any, LogPaginationQueries> {
    abortController?: AbortController;

    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<any>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        this.abortController && this.abortController?.abort();
        this.abortController = new AbortController();

        return axios.get(`${PREFIX}/operation?${searchParams}`, {
            signal: this.abortController?.signal,
        });
    }
}


interface LogPaginationQueries extends PaginationQueries {
}