<template>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 選擇 -->
        <Select name="selectedProjectId" :options="projectList" option-key="id" option-value="name" class="shadow border text-xs"></Select>
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <BoarderCreate :project="projectList?.find((v) => v?.id == values?.selectedProjectId)!" class="grow-[1] lg:basis-1"></BoarderCreate>
            <div class="grow-[1] bg-white h-auto border rounded p-3 text-sm lg:basis-1">
                <div class="grid grid-cols-2 gap-3">
                    <button class="px-8 py-2 text-white bg-gray-600 rounded">交換床位</button>
                </div>
            </div>
        </div>
        <!-- 列表 -->
        <div class="flex flex-col gap-3">
            <div class="w-full lg:w-64">
                <input placeholder="搜尋住宿生姓名、班級、樓寢床" class="text-xs w-full rounded"
                @change=""/>
            </div>
            <div class="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
                <TransitionGroup
                enter-active-class="transition-all duration-1000"
                leave-active-class="transition-all duration-1000"
                enter-from-class="opacity-0 -translate-x-48"
                leave-to-class="opacity-0 -translate-x-48">
                    <Detail v-for="it, index in boarderList" :key="index" class="bg-white">
                        <template #summary="{ isVisable }">
                            <div class="flex justify-between items-center w-full h-full">
                                <div class="flex flex-col flex-1 justify-center">
                                    {{ it?.name }}
                                </div>
                                <Icon icon="ic:round-keyboard-arrow-up" class="w-6 h-6 duration-300" :class="[{ 'rotate-180': isVisable }]"></Icon>
                            </div>
                        </template>
                        <template #content>
                            <div class="text-sm">
                                {{ it?.remark ?? '尚無備註' }}
                            </div>
                        </template>
                    </Detail>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { BoarderPaginator } from '~/composables/api/boarder';
    import { ProjectsCaller } from '~/composables/api/share';

    const { setFieldValue, values } = useForm<{ selectedProjectId?: number }>();

    const boarderPaginator = new BoarderPaginator({ immediate: false });
    const { data: boarderList } = boarderPaginator;
    const projectsCaller = new ProjectsCaller()
    .success((v) => setFieldValue('selectedProjectId', v?.data?.[0]?.id));
    const { data: projectList } = projectsCaller;

    boarderPaginator?.bind('project_id', toRef(values, 'selectedProjectId'))
</script>