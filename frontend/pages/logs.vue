<template>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 內容 -->
        <div class="flex flex-col gap-3">
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <input placeholder="搜尋樓寢床、姓名" class="text-xs w-full rounded border"
                @change=""/>
            </div>
             <!-- 列表 -->
            <div class="w-full overflow-auto bg-white">
                <OrderTable id="id" :headers="headers" :rows="logList">
                    <template #姓名="{ data }">
                        <div class="px-2 py-1">
                            {{ checkValueEmpty(data?.user?.name) }}
                        </div>
                    </template>
                    <template #輪值日="{ data }">{{ checkValueEmpty(data?.start_time, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                    <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                    <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                    <template #更新時間="{ data }">{{ checkValueEmpty(data?.updated_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                    <template #更新者="{ data }">{{ checkValueEmpty(data?.updater?.name) }}</template>
                </OrderTable>
            </div>
            <Paginator :api-paginator="logPaginator"></Paginator>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Icon } from '@iconify/vue';
    import { format } from 'date-fns';
    import { LogPaginator } from '~/composables/api/log';
    import _ from 'lodash';

    const headers = [
        { title: '姓名', values: ['user'] },
        { title: '輪值日', values: ['start_time'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '更新時間', values: ['updated_at'] },
        { title: '更新者', values: ['updater'] },
    ]

    const logPaginator = new LogPaginator();
    const { data: logList } = logPaginator;
</script>
