import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/telCards';

export class TelCardLogPaginator extends ApiPaginator<TelCardLog, TelCardLogPaginationQueries> {
    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<TelCardLog>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/log?${searchParams}`);
    }

    withQuery = <K extends keyof TelCardLogPaginationQueries, V extends TelCardLogPaginationQueries[K]>(key: K, value: V) => {
        if (key === 'project_id') {
            this.projectIdHandler(key, value);
        }
    }

    protected projectIdHandler = _.throttle(this.setQuery, 800);
}

export class TelCardContacterPaginator extends ApiPaginator<TelCardContacter> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<TelCardContacter>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/contacter?${searchParams}`);
    }
}

export class TelCardLogCaller extends ApiCaller<TelCardLog> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<TelCardLog>, any>> {
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

export class TelCardContacterCaller extends ApiCaller<TelCardContacter> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<TelCardContacter>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/contacter/${this?.id}?${searchParams}`);
    }
}

export const createTelCardLog = async (formData: CreateTelCardLogFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/log`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const createTelCardContacter = async (formData: CreateTelCardContacterFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/contacter`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updateTelCardContacter = async (formData: UpdateTelCardContacterFormData) => {
    try {
        const response = await axios.put(`${PREFIX}/contacter`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deleteTelCardLog = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/log/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deleteTelCardContacter = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/contacter/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type Boarder = Model.Boarder & {
    project_bunk: Model.Bunk,
}

type TelCardLog = Model.TelCardLog & Model.CreateInfo & Model.UpdateInfo & {
    boarder: Boarder,
    tel_card_contacter: TelCardContacter,
}

type TelCardContacter = Model.TelCardContacter & Model.CreateInfo & Model.UpdateInfo

interface CreateTelCardLogFormData {
    project_id: number,
    boarder_id: string,
    tel_card_contacter_id: number,
    contacted_at: string,
    remark?: string,
}

interface BaseTelCardContacterFormData {
    name: string,
}

type CreateTelCardContacterFormData = BaseTelCardContacterFormData

type UpdateTelCardContacterFormData = BaseTelCardContacterFormData & {
    id: number,
}

interface TelCardLogPaginationQueries extends PaginationQueries {
    project_id: number,
    boarder_id: number,
}