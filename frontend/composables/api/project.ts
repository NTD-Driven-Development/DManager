import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/projects';

export class ProjectPaginator extends ApiPaginator<Project> {
    constructor() {
        super();
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

        return axios.get(`${PREFIX}?${searchParams}`);
    }

    withQuery = <K extends keyof PaginationQueries, V extends PaginationQueries[K]>(key: K, value: V) => {
        if (key === 'limit') {
            this.limitHandler(key, value);
        }
    };

    protected limitHandler = _.throttle(this.setQuery, 800);
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

    protected define(): Promise<AxiosResponse<ApiResponse<Model.Project>, any>> {
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

export const createProjectBunk =async (id: number, formData: CreateProjectBunkFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/${id}/bunks`, formData);
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

type Project = Model.Project

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

interface CreateProjectBunkFormData {
    floor: number,
    room_type: string,
    room_no: number,
    bed: number,
    name: string,
    sid?: string,
    class?: number,
    boarder_status_id: number,
    remark?: string,
}

interface SwapProjectBunkFormData {
    origin_bunk_id: number,
    origin_boarder_id: string,
    swap_bunk_id: number,
    swap_boarder_id: string,
}

interface ProjectPaginationQueries extends PaginationQueries {

}