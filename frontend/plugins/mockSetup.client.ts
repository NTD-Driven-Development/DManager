import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ApiResponse, PaginationResponse } from '~/core/api';
import _ from 'lodash';

export default defineNuxtPlugin(() => {
    const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

    mock.onGet('/api/exports?project_id=1000000034').reply(200, createResponse({
        data: [
            {
                boarder: {
                    id: '697e9ea9-b1b8-418c-951a-7d5a858aba39',
                    class: {
                        name: '資管五甲',
                    },
                    name: '張瑋言',
                    sid: 1110734026,
                    project_bunk: {
                        floor: '1',
                        room_type: 'E',
                        room_no: '1',
                        bed: '1',
                    },
                },
                tel_card_logs: [
                    {
                        tel_card_contacter: {
                            name: '爸爸',
                        },
                        remark: 'remark',
                        contacted_at: '2020-03-03',
                        created_at: '2020-03-03',
                    },
                    {
                        tel_card_contacter: {
                            name: '媽媽',
                        },
                        remark: 'remark',
                        contacted_at: '2020-03-03',
                        created_at: '2020-03-03',
                    },
                ],
                point_logs: [
                    {
                        point_rule: {
                            code: 'A1',
                            reason: '事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由事由',
                        },
                        point: 2,
                        remark: 'remark',
                        created_at: '2020-03-03',
                    },
                ]
            }
        ],
        statusCode: 200,
    }));
})

const createResponse = <T>(response: Partial<ApiResponse<T>>): ApiResponse<T> => {
    const result = _.defaultsDeep(response, { statusCode: 200 } as ApiResponse<T>);
    return result;
}

const createPaginationResponse = <T, P = PaginationResponse<T>>(response: Partial<ApiResponse<P>>): ApiResponse<P> => {
    const result = _.defaultsDeep(response, { statusCode: 200 } as ApiResponse<P>);
    return result;
}