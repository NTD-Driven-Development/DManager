import axios, { AxiosResponse } from "axios";
import { ApiPaginator, ApiResponse, PaginationResponse, PaginationQueries, Options, ApiCaller } from "~/core/api";
import _ from "lodash";
import * as Model from "~/src/model";

const PREFIX = '/api/points';

export class PointLogPaginator extends ApiPaginator<PointLog, PointLogPaginationQueries> {
    abortController?: AbortController;

    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<PointLog>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        this.abortController && this.abortController?.abort();
        this.abortController = new AbortController();

        return axios.get(`${PREFIX}/log?${searchParams}`, {
            signal: this.abortController?.signal,
        });
    }

    withQuery = <K extends keyof PointLogPaginationQueries, V extends PointLogPaginationQueries[K]>(key: K, value: V) => {
        if (key == 'offset') {
            this.offsetHandler(key, value);
        }
        else if (key === 'project_id') {
            this.projectIdHandler(key, value);
        }
        else if (key === 'search') {
            this.searchHandler(key, value);
        }
    }

    protected offsetHandler = _.debounce(this.setQuery, 500);
    protected projectIdHandler = _.debounce(this.setQuery, 500);
    protected searchHandler = _.debounce(this.setQuery, 500);
}

export class PointRulePaginator extends ApiPaginator<PointRule, PointRulePaginationQueries> {
    abortController?: AbortController;

    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<PointRule>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        this.abortController && this.abortController?.abort();
        this.abortController = new AbortController();

        return axios.get(`${PREFIX}/rule?${searchParams}`, {
            signal: this.abortController?.signal,
        });
    }

    withQuery = <K extends keyof PointRulePaginationQueries, V extends PointRulePaginationQueries[K]>(key: K, value: V) => {
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

export class PointLogCaller extends ApiCaller<PointLog> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PointLog>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/log/${this?.id}?${searchParams}`);
    }
}

export class PointRuleCaller extends ApiCaller<PointRule> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PointRule>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/rule/${this?.id}?${searchParams}`);
    }
}

export const createPointLog = async (formData: CreatePointLogFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/log`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const createPointRule = async (formData: CreatePointRuleFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/rule`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updatePointRule = async (formData: UpdatePointRuleFormData) => {
    try {
        const response = await axios.put(`${PREFIX}/rule`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deletePointLog = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/log/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deletePointRule = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/rule/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type Boarder = Model.Boarder & {
    project_bunk: Model.Bunk,
}

type PointLog = Model.PointLog & Model.CreateInfo & Model.UpdateInfo & {
    boarder: Boarder,
    project: Model.Project,
    point_rule: Model.PointRule,
}

type PointRule = Model.PointRule & Model.CreateInfo & Model.UpdateInfo

interface CreatePointLogFormData {
    project_id: number,
    boarder_id: string,
    point_rule_id: number,
    point: number,
    remark?: string,
}

interface BasePointRuleFormData {
    code: string,
    reason: string,
    point: number,
}

type CreatePointRuleFormData = BasePointRuleFormData

type UpdatePointRuleFormData = BasePointRuleFormData & {
    id: number,
}

interface PointLogPaginationQueries extends PaginationQueries {
    project_id?: number,
    search?: string,
}

interface PointRulePaginationQueries extends PaginationQueries {
    search?: string,
}