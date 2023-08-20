import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiPaginator, ApiResponse, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/projects';

export class ProjectPaginator extends ApiPaginator<Project> {
    constructor() {
        super();
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
}

export class ProjectCaller extends ApiCaller<Project> {
    id?: number;

    constructor(id: number) {
        super();
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
};

export const importProject = async (formData: ImportProjectFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/import`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
};

export const updateProject = async (id: number, formData: UpdateProjectFormData) => {
    try {
        const response = await axios.put(`${PREFIX}/${id}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
};

export const deleteProject = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
};

type Project = Model.Project

interface BaseProjectFormData {
    name: string,
    remark?: string,
}

type CreateProjectFormData = BaseProjectFormData

type ImportProjectFormData = BaseProjectFormData & {
    file: string,
}

type UpdateProjectFormData = BaseProjectFormData