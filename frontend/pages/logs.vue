<template>
    <Title>{{ `操作記錄 - Dormiday` }}</Title>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 內容 -->
        <div class="flex flex-col gap-3">
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <input placeholder="搜尋使用者ID、使用者名稱、詳情" class="text-xs w-full rounded border"
                @change=""/>
            </div>
             <!-- 列表 -->
            <div class="w-full overflow-auto bg-white">
                <OrderTable id="id" :headers="headers" :rows="logList">
                    <template #使用者ID="{ data }">
                        <div class="px-2 py-1">
                            {{ checkValueEmpty(data?.user_id) }}
                        </div>
                    </template>
                    <template #使用者名稱="{ data }">{{ checkValueEmpty(data?.user_name) }}</template>
                    <template #詳情="{ data }">{{ checkValueEmpty(data?.detail) }}</template>
                    <template #操作時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                </OrderTable>
            </div>
            <Paginator :api-paginator="logPaginator"></Paginator>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { format } from 'date-fns';
    import { LogPaginator } from '~/composables/api/log';
    import _ from 'lodash';

    const headers = [
        { title: '使用者ID', values: ['user_id'] },
        { title: '使用者名稱', values: ['user_name'] },
        { title: '詳情', values: ['detail'] },
        { title: '操作時間', values: ['created_at'] },
    ]

    const logPaginator = new LogPaginator();
    const { data: logList } = logPaginator;
</script>
