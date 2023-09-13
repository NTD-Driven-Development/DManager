import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/users';

export class UserPaginator extends ApiPaginator<User> {
    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<User>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}?${searchParams}`);
    }

    // withQuery = <K extends keyof BoarderNotePaginationQueries, V extends BoarderNotePaginationQueries[K]>(key: K, value: V) => {
    //     if (key === 'project_id') {
    //         this.projectIdHandler(key, value);
    //     }
    // }

    // protected projectIdHandler = _.throttle(this.setQuery, 800);
}

export class UserCaller extends ApiCaller<User> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<User>, any>> {
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

export const createUser =async (formData: CreateUserFormData) => {
    try {
        const response = await axios.post(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updateUser = async (formData: UpdateUserFormData) => {
    try {
        const response = await axios.put(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deleteUser = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type User = Model.User & Model.CreateInfo & Model.UpdateInfo & {
    roles: Model.Role[],
}

interface CreateUserFormData {
    email: string,
    name: string,
    sid: string,
    remark?: string,
    role_ids?: number,
}

interface UpdateUserFormData {
    id: number,
    name: string,
    sid: string,
    remark?: string,
    role_ids?: number,
}

interface UserPaginationQueries extends PaginationQueries {
}