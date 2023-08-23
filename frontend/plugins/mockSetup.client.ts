import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ApiResponse, PaginationResponse } from '~/core/api';
import { Boarder, BoarderStatus, Project } from '~/src/model';
import _ from 'lodash';

export default defineNuxtPlugin(() => {
    const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

    // mock.onGet('/api/projects?').reply(200, createPaginationResponse<Project>({
    //     data: {
    //         from: 1,
    //         to: 10,
    //         total: 100,
    //         per_page: 10,
    //         current_page: 1,
    //         last_page: 10,
    //         items: [
    //             { id: 1, name: '110學年', remark: '備註' },
    //             { id: 2, name: '111學年' },
    //             { id: 3, name: '112學年', remark: '備註' },
    //             { id: 4, name: '113學年' },
    //             { id: 5, name: '114學年', remark: '備註' },
    //             { id: 6, name: '115學年' },
    //             { id: 7, name: '116學年', remark: '備註' },
    //             { id: 8, name: '117學年' },
    //         ],
    //     }
    // }));

    // mock.onGet('/api/share/projects?').reply(200, createResponse<Project[]>({
    //     data: [
    //         { id: 1, name: '110學年', remark: '備註' },
    //         { id: 2, name: '111學年' },
    //         { id: 3, name: '112學年', remark: '備註' },
    //         { id: 4, name: '113學年' },
    //         { id: 5, name: '114學年', remark: '備註' },
    //         { id: 6, name: '115學年' },
    //         { id: 7, name: '116學年', remark: '備註' },
    //         { id: 8, name: '117學年' },
    //     ]
    // }));

    // mock.onGet('/api/boarders?project_id=1').reply(200, createPaginationResponse<Boarder>({
    //     data: {
    //         from: 1,
    //         to: 10,
    //         total: 100,
    //         per_page: 10,
    //         current_page: 1,
    //         last_page: 10,
    //         items: [
    //             { sid: 1, name: '學生1', remark: '備註' },
    //             { sid: 2, name: '學生2', remark: '備註' },
    //             { sid: 3, name: '學生3', remark: '備註' },
    //             { sid: 4, name: '學生4', remark: '備註' },
    //             { sid: 5, name: '學生5', remark: '備註' },
    //             { sid: 6, name: '學生6', remark: '備註' },
    //             { sid: 7, name: '學生7', remark: '備註' },
    //         ],
    //     }
    // }));
    // mock.onGet('/api/boarders?project_id=2').reply(200, createPaginationResponse<Boarder>({
    //     data: {
    //         from: 1,
    //         to: 10,
    //         total: 100,
    //         per_page: 10,
    //         current_page: 2,
    //         last_page: 10,
    //         items: [
    //             { sid: 1, name: '學生1', remark: '備註' },
    //             { sid: 2, name: '學生2', remark: '備註' },
    //             { sid: 5, name: '學生5', remark: '備註' },
    //             { sid: 6, name: '學生6', remark: '備註' },
    //             { sid: 7, name: '學生7', remark: '備註' },
    //         ],
    //     }
    // }));
})

const createResponse = <T>(response: Partial<ApiResponse<T>>): ApiResponse<T> => {
    const result = _.defaultsDeep(response, { statusCode: 200 } as ApiResponse<T>);
    return result;
}

const createPaginationResponse = <T, P = PaginationResponse<T>>(response: Partial<ApiResponse<P>>): ApiResponse<P> => {
    const result = _.defaultsDeep(response, { statusCode: 200 } as ApiResponse<P>);
    return result;
}