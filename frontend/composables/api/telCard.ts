import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiPaginator, ApiResponse, Options, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/telCards';

export class TelCardPaginator extends ApiPaginator<TelCard> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<TelCard>>, any>> {
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

    protected define(): Promise<AxiosResponse<ApiResponse<Model.BoarderStatus>, any>> {
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

type TelCard = Model.TelCard

type TelCardContacter = Model.TelCardContacter

interface BaseTelCardContacterFormData {
    name: string,
}

type CreateTelCardContacterFormData = BaseTelCardContacterFormData

type UpdateTelCardContacterFormData = BaseTelCardContacterFormData & {
    id: number,
}