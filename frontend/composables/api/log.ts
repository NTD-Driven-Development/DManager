import axios, { AxiosResponse } from 'axios';
import { ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import { mapping } from '~/src/logMapping';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/logs';

export class LogPaginator extends ApiPaginator<OperationLog, LogPaginationQueries> {
    abortController?: AbortController;

    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<OperationLog>>, any>> {
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

    withQuery = <K extends keyof LogPaginationQueries, V extends LogPaginationQueries[K]>(key: K, value: V) => {
        if (key == 'offset') {
            this.offsetHandler(key, value);
        }
        else if (key === 'search') {
            this.searchHandler(key, value);
        }
    }

    protected offsetHandler = _.debounce(this.setQuery, 500);
    protected searchHandler = _.debounce(this.setQuery, 500);
}

export const parseOperationLogDetail = (log: Pick<OperationLog, 'url' | 'http_method' | 'user_id' | 'user_name' | 'body' | 'detail'>) => {
    const target = mapping.find((v) => v?.url == log?.url && v?.method == log?.http_method);
    
    return target?.template(log.user_id, log.user_name, JSON.parse(log.body), JSON.parse(log.detail));
}

type OperationLog = Model.OperationLog & Model.CreateInfo

interface LogPaginationQueries extends PaginationQueries {
    search?: string,
}