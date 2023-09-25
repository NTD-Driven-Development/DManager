<template>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 選擇項目 -->
        <div class="flex flex-col gap-1">
            <div class="text-sm">選擇項目：</div>
            <Select name="selectedProjectId" class="shadow border text-xs"
            :options="projectList" option-key="id" option-value="name" ></Select>
        </div>
        <!-- 內容 -->
        <div class="flex flex-col gap-3">
            <!-- 操作 -->
            <div class="flex flex-col gap-2 lg:flex-row">
                <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5">
                    <div class="grid grid-cols-2 gap-3">
                        {{ '統計數據' }}
                    </div>
                </div>
                <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5">
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button class="py-2 text-white bg-gray-600 rounded" @click="exportBoarderPopUp?.show(values?.selectedProjectId)">匯出指定學生紀錄</button>
                        <button class="py-2 text-white bg-gray-600 rounded" @click="exportAreaPopUp?.show(values?.selectedProjectId)">匯出指定區域紀錄</button>
                    </div>
                </div>
            </div>
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <input placeholder="搜尋住宿生姓名、班級、樓寢床" class="text-xs w-full rounded border"
                @change=""/>
            </div>
            <!-- 列表 -->
            <div class="flex flex-col gap-2">
                <TransitionGroup
                enter-active-class="transition-all duration-1000"
                leave-active-class="transition-all duration-1000"
                enter-from-class="opacity-0 -translate-x-48"
                leave-to-class="opacity-0 -translate-x-48">
                    <Detail v-for="it, index in exportItemList" :key="index" class="bg-white">
                        <template #summary="{ isVisable }">
                            <div class="flex justify-between items-center w-full h-full">
                                <div class="flex flex-1 gap-1">
                                    <span>{{ toStringlish(it?.boarder?.project_bunk) }}</span>
                                    <span>{{ it?.boarder?.name }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon icon="ic:round-keyboard-arrow-down" class="w-6 h-6 duration-300" :class="[{ 'rotate-180': isVisable }]"></Icon>
                                </div>
                            </div>
                        </template>
                        <template #content>
                            <div class="flex flex-col gap-1 text-sm">
                                <ExportBoarderContent :export-item="it" class="flex"></ExportBoarderContent>
                            </div>
                        </template>
                    </Detail>
                </TransitionGroup>
            </div>
        </div>
        <ExportBoarderPopUp ref="exportBoarderPopUp" @on-exported=""></ExportBoarderPopUp>
        <ExportAreaPopUp ref="exportAreaPopUp" @on-exported=""></ExportAreaPopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { ProjectsCaller } from '~/composables/api/share';
    import { ExportCaller } from '~/composables/api/export';
    import _ from 'lodash';

    const { setFieldValue, values } = useForm<{ selectedProjectId?: number }>();

    const exportBoarderPopUp = ref();
    const exportAreaPopUp = ref();

    const projectsCaller = new ProjectsCaller()
    .success((v) => setFieldValue('selectedProjectId', v?.data?.[0]?.id));
    const { data: projectList } = projectsCaller;
    const exportPaginator = new ExportCaller({ immediate: false });
    const { data: exportItemList } = exportPaginator;

    exportPaginator?.bind('project_id', toRef(values, 'selectedProjectId'));
</script>