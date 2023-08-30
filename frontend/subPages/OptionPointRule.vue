<template>
    <div class="flex flex-col gap-3">
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <OptionPointRuleCreate class="grow-[1] lg:basis-1"
            @on-created="pointRulePaginator?.reload()"></OptionPointRuleCreate>
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
            <OrderTable id="id" :headers="headers" :rows="PointRuleList">
                <template #代號="{ data }">
                    <div class="px-2 py-1">
                        {{ checkValueEmpty(data?.code) }}
                    </div>
                </template>
                <template #事由="{ data }">{{ checkValueEmpty(data?.reason) }}</template>
                <template #點數="{ data }">{{ checkValueEmpty(data?.point) }}</template>
                <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => toSimpleDate(v)) }}</template>
                <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                <template #更新時間="{ data }">{{ checkValueEmpty(data?.updated_at, (v) => toSimpleDate(v)) }}</template>
                <template #更新者="{ data }">{{ checkValueEmpty(data?.updater?.name) }}</template>
                <template #操作="{ id }">
                    <div class="flex gap-2">
                        <Icon icon="ic:round-mode-edit" class="cursor-pointer" @click="optionPointRuleEditPopUp?.show(id)"></Icon>
                    </div>
                </template>
            </OrderTable>
        </div>
        <Paginator :api-paginator="pointRulePaginator"></Paginator>
        <OptionPointRuleEditPopUp ref="optionPointRuleEditPopUp" @on-edited="pointRulePaginator?.reload()"></OptionPointRuleEditPopUp>
    </div>
</template>

<script setup lang="ts">
    import { Icon } from '@iconify/vue';
    import { PointRulePaginator } from '~/composables/api/pointRule';

    const headers = [
        { title: '代號', values: ['code'] },
        { title: '事由', values: ['reason'] },
        { title: '點數', values: ['point'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '更新時間', values: ['updated_at'] },
        { title: '更新者', values: ['updater'] },
        { title: '操作', values: [] }
    ]

    const optionPointRuleEditPopUp = ref();

    const pointRulePaginator = new PointRulePaginator();
    const { data: PointRuleList } = pointRulePaginator;
</script>