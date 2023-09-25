<template>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 內容 -->
        <div class="flex flex-col gap-3">
            <!-- 操作 -->
            <div class="flex flex-col gap-2 lg:flex-row">
                <UserDutyCreate class="grow-[1] lg:basis-1"
                @on-created="userDutyPaginator?.reload()"></UserDutyCreate>
                <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5">
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    </div>
                </div>
            </div>
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <input placeholder="搜尋姓名" class="text-xs w-full rounded border"
                @change=""/>
            </div>
            <div>
                <VueDatePicker multi-dates menu-class-name="fixed z-20" locale="zh-TW"
                    input-class-name="!text-xs h-[38px] placeholder:text-gray-500" :min-date="new Date()" placeholder="篩選輪值日"
                    :format="(v: any[]) => v?.map((v) => format(v, 'yyyy-MM-dd'))?.join('、')"
                    @update:model-value="(v: any[]) => selectedDateList = v?.map((v) => formatISO(v))"
                    :model-value="selectedDateList" :enable-time-picker="false"></VueDatePicker>
            </div>
             <!-- 列表 -->
            <div class="w-full overflow-auto bg-white">
                <OrderTable id="id" :headers="headers" :rows="userDutyList">
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
                    <template #操作="{ id }">
                        <div class="flex gap-2 text-base">
                            <Icon icon="ic:round-delete" class="cursor-pointer text-red-600" @click="userDutyDeletePopUp?.show(id)"></Icon>
                        </div>
                    </template>
                </OrderTable>
            </div>
            <Paginator :api-paginator="userDutyPaginator"></Paginator>
        </div>
        <UserDutyDeletePopUp ref="userDutyDeletePopUp" @on-deleted="userDutyPaginator?.reload()"></UserDutyDeletePopUp>
    </div>
</template>

<script setup lang="ts">
    import { Icon } from '@iconify/vue';
    import { format } from 'date-fns';
    import { UserDutyPaginator } from '~/composables/api/user';
    import VueDatePicker from '@vuepic/vue-datepicker';
    import _ from 'lodash';
    import '@vuepic/vue-datepicker/dist/main.css';
import { formatISO } from 'date-fns';

    const headers = [
        { title: '姓名', values: ['user'] },
        { title: '輪值日', values: ['start_time'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '更新時間', values: ['updated_at'] },
        { title: '更新者', values: ['updater'] },
        { title: '操作', values: [] }
    ]

    const userDutyDeletePopUp = ref();
    const selectedDateList = ref();

    const userDutyPaginator = new UserDutyPaginator();
    const { data: userDutyList } = userDutyPaginator;
    
    userDutyPaginator.bind('start_times', selectedDateList);
</script>