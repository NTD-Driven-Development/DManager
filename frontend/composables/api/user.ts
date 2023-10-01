import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/users';

export class UserPaginator extends ApiPaginator<User, UserPaginationQueries> {
    abortController?: AbortController;

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

        this.abortController && this.abortController?.abort();
        this.abortController = new AbortController();

        return axios.get(`${PREFIX}?${searchParams}`, {
            signal: this.abortController?.signal,
        });
    }

    withQuery = <K extends keyof UserPaginationQueries, V extends UserPaginationQueries[K]>(key: K, value: V) => {
        if (key === 'offset') {
            this.offsetHandler(key, value);
        }
        else if (key === 'search') {
            this.searchHandler(key, value);
        }
    }

    protected offsetHandler = _.debounce(this.setQuery, 500);
    protected searchHandler = _.debounce(this.setQuery, 500);
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

export class UserDutyPaginator extends ApiPaginator<UserDuty, UserDutyPaginationQueries> {
    abortController?: AbortController;

    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<UserDuty>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        this.abortController && this.abortController?.abort();
        this.abortController = new AbortController();

        return axios.get(`${PREFIX}/duty?${searchParams}`, {
            signal: this.abortController?.signal,
        });
    }

     withQuery = <K extends keyof UserDutyPaginationQueries, V extends UserDutyPaginationQueries[K]>(key: K, value: V) => {
        if (key === 'offset') {
            this.offsetHandler(key, value);
        }
        else if (key === 'search') {
            this.searchHandler(key, value);
        }
        else if (key === 'start_times') {
            this.startTimesHandler(key, value);
        }
    }

    protected offsetHandler = _.debounce(this.setQuery, 500);
    protected searchHandler = _.debounce(this.setQuery, 500);
    protected startTimesHandler = _.debounce(this.setQuery, 500);
}

export class UserDutyCaller extends ApiCaller<UserDuty> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<UserDuty>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/duty/${this?.id}?${searchParams}`);
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

export const createUserDuty =async (formData: CreateUserDutyFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/duty`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updateUserDuty = async (formData: UpdateUserDutyFormData) => {
    try {
        const response = await axios.put(`${PREFIX}/duty`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deleteUserDuty = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/duty/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type User = Model.User & Model.CreateInfo & Model.UpdateInfo & {
    roles: Model.Role[],
}

type UserDuty = Model.UserDuty & Model.CreateInfo & Model.UpdateInfo & {
    user: Model.User,
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

interface CreateUserDutyFormData {
    user_id: number,
    start_time: string,
    end_time: string,
}

interface UpdateUserDutyFormData {
    id: number,
    user_id: number,
    start_time: string,
    end_time: string,
}


interface UserPaginationQueries extends PaginationQueries {
    search?: string,
}

interface UserDutyPaginationQueries extends PaginationQueries {
    search?: string,
    start_times?: string[],
}