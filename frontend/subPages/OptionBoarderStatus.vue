<template>
    <div class="flex flex-col gap-3">
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <OptionBoarderStatusCreate class="grow-[1] lg:basis-1"
            @on-created="boarderStatusPaginator?.reload()"></OptionBoarderStatusCreate>
            <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5">
            </div>
        </div>
        <!-- 搜尋 -->
        <div class="w-full lg:w-64 border">
            <input placeholder="搜尋名稱" class="text-xs w-full rounded"
            @change=""/>
        </div>
        <!-- 列表 -->
        <div class="w-full overflow-auto bg-white">
            <OrderTable id="id" :headers="headers" :rows="boarderStatusList">
                <template #名稱="{ data }">
                    <div class="px-2 py-1">
                        {{ checkValueEmpty(data?.name) }}
                    </div>
                </template>
                <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => toSimpleDate(v)) }}</template>
                <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                <template #更新時間="{ data }">{{ checkValueEmpty(data?.updated_at, (v) => toSimpleDate(v)) }}</template>
                <template #更新者="{ data }">{{ checkValueEmpty(data?.updater?.name) }}</template>
                <template #操作="{ id }">
                    <div class="flex gap-2 text-base">
                        <Icon icon="ic:round-mode-edit" class="cursor-pointer" @click="optionBoarderStatusEditPopUp?.show(id)"></Icon>
                        <Icon icon="ic:round-delete" class="cursor-pointer text-red-600" @click="optionBoarderStatusDeletePopUp?.show(id)"></Icon>
                    </div>
                </template>
            </OrderTable>
        </div>
        <Paginator :api-paginator="boarderStatusPaginator"></Paginator>
        <OptionBoarderStatusEditPopUp ref="optionBoarderStatusEditPopUp" @on-edited="boarderStatusPaginator?.reload()"></OptionBoarderStatusEditPopUp>
        <OptionBoarderStatusDeletePopUp ref="optionBoarderStatusDeletePopUp" @on-deleted="boarderStatusPaginator?.reload()"></OptionBoarderStatusDeletePopUp>
    </div>
</template>

<script setup lang="ts">
    import { Icon } from '@iconify/vue';
import { BoarderDeletePopUp } from '~/.nuxt/components';
    import { BoarderStatusPaginator } from '~/composables/api/boarderStatus';

    const headers = [
        { title: '名稱', values: ['name'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '更新時間', values: ['updated_at'] },
        { title: '更新者', values: ['updater'] },
        { title: '操作', values: [] }
    ]

    const optionBoarderStatusEditPopUp = ref();
    const optionBoarderStatusDeletePopUp = ref();

    const boarderStatusPaginator = new BoarderStatusPaginator();
    const { data: boarderStatusList } = boarderStatusPaginator;
</script>