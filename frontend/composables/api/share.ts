import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiResponse } from '~/core/api';
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

export class BoarderRolesCaller extends ApiCaller<BoarderRole[]> {
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

        return axios.get(`${PREFIX}/pointRules?${searchParams}`);
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

        return axios.get(`${PREFIX}/telCardContracters?${searchParams}`);
    }
}

type Project = Model.Project

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