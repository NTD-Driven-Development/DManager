<template>
    <div class="flex flex-col gap-3">
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <OptionBoarderStatusCreate  class="grow-[1] max-w-sm lg:basis-1"
            @on-created="boarderStatusPaginator?.reload()"></OptionBoarderStatusCreate>
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
                        {{ data?.name }}
                    </div>
                </template>
                <template #建立時間="{ data }">{{ toSimpleDate(data?.created_at) ?? '--' }}</template>
                <template #建立者="{ data }">{{ data?.created_by ?? '--' }}</template>
                <template #更新時間="{ data }">{{ toSimpleDate(data?.created_at) ?? '--' }}</template>
                <template #更新者="{ data }">{{ data?.created_by ?? '--' }}</template>
                <template #操作="{ id }">
                    <div class="flex gap-2">
                        <Icon icon="ic:round-mode-edit" class="cursor-pointer" @click="optionBoarderStatusEditPopUp?.show(id)"></Icon>
                    </div>
                </template>
            </OrderTable>
        </div>
        <Paginator :api-paginator="boarderStatusPaginator"></Paginator>
        <OptionBoarderStatusEditPopUp ref="optionBoarderStatusEditPopUp" @on-saved="boarderStatusPaginator?.reload()"></OptionBoarderStatusEditPopUp>
    </div>
</template>

<script setup lang="ts">
    import { Icon } from '@iconify/vue';
    import { BoarderStatusPaginator } from '~/composables/api/boarderStatus';

    const headers = [
        { title: '名稱', values: ['name'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['created_by'] },
        { title: '更新時間', values: ['created_at'] },
        { title: '更新者', values: ['created_by'] },
        { title: '操作', values: [] }
    ]

    const optionBoarderStatusEditPopUp = ref();

    const boarderStatusPaginator = new BoarderStatusPaginator();
    const { data: boarderStatusList } = boarderStatusPaginator;
</script>