import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/projects';

export class ProjectPaginator extends ApiPaginator<Project, ProjectPaginationQueries> {
    abortController?: AbortController;

    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 18;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<Project>>, any>> {
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

    withQuery = <K extends keyof ProjectPaginationQueries, V extends ProjectPaginationQueries[K]>(key: K, value: V) => {
        if (key === 'offset') {
            this.offsetHandler(key, value);
        }
        else if (key === 'limit') {
            this.limitHandler(key, value);
        }
        else if (key === 'search') {
            this.searchHandler(key, value);
        }
    }

    protected offsetHandler = _.debounce(this.setQuery, 500);
    protected limitHandler = _.debounce(this.setQuery, 500);
    protected searchHandler = _.debounce(this.setQuery, 500);
}

export class ProjectCaller extends ApiCaller<Project> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<Project>, any>> {
        return axios.get(`${PREFIX}/${this.id}`);
    }
}

export const createProject = async (formData: CreateProjectFormData) => {
    try {
        const response = await axios.post(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const importProject = async (formData: ImportProjectFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/import`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updateProject = async (formData: UpdateProjectFormData) => {
    try {
        const response = await axios.put(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const swapProjectBunk =async (id: number, formData: SwapProjectBunkFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/${id}/swapBunk`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deleteProject = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type Project = Model.Project & Model.CreateInfo & Model.UpdateInfo

export interface ProjectImportItem {
    floor: string,
    room_type: string,
    room_no: string,
    bed: string,
    name: string,
    sid?: string,
    remark?: string,
    new_boarder_roles?: string[],
    new_class?: string[],
    class_id?: number,
}

interface CreateProjectFormData {
    name: string,
    remark?: string,
}

interface ImportProjectFormData {
    project_id: number,
    default_boarder_status_id: number,
    all_new_boarder_roles: string[],
    all_new_classes: string[],
    items: ProjectImportItem[],
}

interface UpdateProjectFormData {
    id: number,
    name: string,
    remark?: string,
}

interface SwapProjectBunkFormData {
    origin_bunk_id: number,
    origin_boarder_id: string,
    swap_bunk_id: number,
    swap_boarder_id: string,
}

interface ProjectPaginationQueries extends PaginationQueries {
    search?: string,
}