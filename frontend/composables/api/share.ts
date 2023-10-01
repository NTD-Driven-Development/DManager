import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiResponse, Options, Queries } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/share';

export class ProjectsCaller extends ApiCaller<Project[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<Project[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/projects?${searchParams}`);
    }
}

export class BunksCaller extends ApiCaller<Floor[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }
    
    protected define(): Promise<AxiosResponse<ApiResponse<Floor[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/bunks?${searchParams}`);
    }
}

export class BoardersCaller extends ApiCaller<Boarder[], BoardersQueries> {
    abortController?: AbortController;

    constructor(options?: Options) {
        super(options);
        this.startQueriesWatcher();
    }
    
    protected define(): Promise<AxiosResponse<ApiResponse<Boarder[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        this.abortController && this.abortController?.abort();
        this.abortController = new AbortController();

        return axios.get(`${PREFIX}/boarders?${searchParams}`, {
            signal: this.abortController?.signal,
        });
    }

    withQuery = <K extends keyof BoardersQueries, V extends BoardersQueries[K]>(key: K, value: V) => {
        if (key === 'project_id') {
            this.projectIdHandler(key, value);
        }
    };

    protected projectIdHandler = _.debounce(this.setQuery, 500);
}

export class UsersCaller extends ApiCaller<User[]> {
    constructor(options?: Options) {
        super(options);
        this.startQueriesWatcher();
    }
    
    protected define(): Promise<AxiosResponse<ApiResponse<User[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/users?${searchParams}`);
    }
}

export class RolesCaller extends ApiCaller<Role[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<Role[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/roles?${searchParams}`);
    }
}

export class BoarderStatusesCaller extends ApiCaller<BoarderStatus[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<BoarderStatus[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/boarderStatuses?${searchParams}`);
    }
}

export class ClassesCaller extends ApiCaller<Class[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<Class[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/classes?${searchParams}`);
    }
}

export class BoarderRolesCaller extends ApiCaller<BoarderRole[], BoarderRolesQueries> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<BoarderRole[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/boarderRoles?${searchParams}`);
    }

    withQuery = <K extends keyof BoarderRolesQueries, V extends BoarderRolesQueries[K]>(key: K, value: V) => {
        if (key === 'project_id') {
            this.projectIdHandler(key, value);
        }
    }
    
    protected projectIdHandler = _.debounce(this.setQuery, 500);
}

export class PointRulesCaller extends ApiCaller<PointRule[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PointRule[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/points/rule?${searchParams}`);
    }
}

export class TelCardContractersCaller extends ApiCaller<TelCardContracter[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<TelCardContracter[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/telCards/contacter?${searchParams}`);
    }
}

type Project = Model.Project

type Boarder = Model.Boarder & {
    project_bunk: Model.Bunk,
    class: Model.Class,
}

type User = Model.User;

type Role = Model.Role;

type BoarderStatus = Model.BoarderStatus

type Class = Model.Class

type BoarderRole = Model.BoarderRole

type PointRule = Model.PointRule

type TelCardContracter = Model.TelCardContacter

interface RoomNo {
    no: number,
    beds: number[],
}

interface Room {
    type: string,
    numbers: RoomNo[],
}

interface Floor {
    floor: number,
    rooms: Room[],
}

interface BoardersQueries extends Queries {
    project_id?: number,
}

interface BoarderRolesQueries extends Queries {
    project_id?: number,
}