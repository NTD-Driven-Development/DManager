import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/boarders';

export class BoarderPaginator extends ApiPaginator<Boarder, BoarderPaginationQueries> {
    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 18;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<Boarder>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}?${searchParams}`);
    }

    withQuery = <K extends keyof BoarderPaginationQueries, V extends BoarderPaginationQueries[K]>(key: K, value: V) => {
        if (key === 'project_id') {
            this.projectIdHandler(key, value);
        }
    }

    protected projectIdHandler = _.throttle(this.setQuery, 800);
}

export class BoarderCaller extends ApiCaller<Boarder> {
    id?: string;

    constructor(id?: string) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<Boarder>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/${this?.id}?${searchParams}`);
    }
}

export const createBoarder =async (formData: CreateBoarderFormData) => {
    try {
        const response = await axios.post(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updateBoarder = async (formData: UpdateBoarderFormData) => {
    try {
        const response = await axios.put(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deleteBoarder = async (id: string) => {
    try {
        const response = await axios.delete(`${PREFIX}/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type Boarder = Model.Boarder & Model.CreateInfo & Model.UpdateInfo & {
    class: Model.Class,
    boarder_status: Model.BoarderStatus,
    boarder_roles: Model.BoarderRole[],
    project: Model.Project,
    project_bunk: Model.Bunk,
}

interface CreateBoarderFormData {
    project_id: number,
    floor: number,
    room_type: string,
    room_no: number,
    bed: number,
    name: string,
    sid?: string,
    class_id?: number,
    boarder_status_id: number,
    remark?: string,
}

interface UpdateBoarderFormData {
    id: string,
    sid?: string,
    name: string,
    phone?: string,
    class_id?: number,
    birthday?: string,
    avatar?: string,
    remark?: string,
    access_card?: string,
    boarder_status_id: number,
    boarder_role_ids: number[],
}

interface BoarderPaginationQueries extends PaginationQueries {
    project_id?: number,
}