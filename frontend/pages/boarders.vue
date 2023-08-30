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
                <BoarderCreate :project-id="values?.selectedProjectId!" class="grow-[1] lg:basis-1"
                @on-created="boarderPaginator?.reload()"></BoarderCreate>
                <div class="grow-[1] bg-white h-auto border rounded p-3 text-sm lg:basis-1">
                    <div class="grid grid-cols-2 gap-3">
                        <button class="px-8 py-2 text-white bg-gray-600 rounded" @click="boarderSwapPopUp?.show(values?.selectedProjectId)">交換床位</button>
                    </div>
                </div>
            </div>
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <input placeholder="搜尋住宿生姓名、班級、樓寢床" class="text-xs w-full rounded"
                @change=""/>
            </div>
            <!-- 列表 -->
            <div class="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
                <TransitionGroup
                enter-active-class="transition-all duration-1000"
                leave-active-class="transition-all duration-1000"
                enter-from-class="opacity-0 -translate-x-48"
                leave-to-class="opacity-0 -translate-x-48">
                    <Detail v-for="it, index in boarderList" :key="index" class="bg-white">
                        <template #summary="{ isVisable }">
                            <div class="flex justify-between items-center w-full h-full">
                                <div class="flex flex-1 gap-1">
                                    <span>{{ toStringlish(it?.project_bunk) }}</span>
                                    <span>{{ it?.name }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon icon="ic:round-mode-edit" class="w-5 h-5 duration-300 cursor-pointer" @mousedown.stop @mouseup.stop="boarderEditPopUp?.show(it?.id)"></Icon>
                                    <Icon icon="ic:round-keyboard-arrow-up" class="w-6 h-6 duration-300" :class="[{ 'rotate-180': isVisable }]"></Icon>
                                </div>
                            </div>
                        </template>
                        <template #content>
                            <div class="flex flex-col gap-1 text-sm">
                                <div class="flex">
                                    <div class="basis-0 grow">
                                        <span>學號：</span>
                                        <span>{{ !_.isEmpty(it?.sid) ? it?.sid : '--' }}</span>
                                    </div>
                                    <div class="basis-0 grow">
                                        <span>班級：</span>
                                        <span>{{ !_.isEmpty(it?.class?.name) ? it?.class?.name : '--' }}</span>
                                    </div>
                                </div>
                                <div class="flex">
                                    <div class="basis-0 grow">
                                        <span>電話：</span>
                                        <span>{{ !_.isEmpty(it?.phone) ? it?.phone : '--' }}</span>
                                    </div>
                                    <div class="basis-0 grow">
                                        <span>生日：</span>
                                        <span>{{ !_.isEmpty(it?.birthday) ? new Date(it?.birthday ?? '').toISOString().split('T')[0] : '--' }}</span>
                                    </div>
                                </div>
                                <div class="flex">
                                    <div class="basis-0 grow">
                                        <span>門禁卡號：</span>
                                        <span>{{ !_.isEmpty(it?.access_card) ? it?.access_card : '--' }}</span>
                                    </div>
                                    <div class="basis-0 grow">  
                                        <span>住宿狀態：</span>
                                        <span>{{ !_.isEmpty(it?.boarder_status?.name) ? it?.boarder_status?.name : '--' }}</span>
                                    </div>
                                </div>
                                <div class="flex">
                                    <div class="basis-0 grow">
                                        <span>身份別：</span>
                                        <span>{{ it?.boarder_roles?.length ? it?.boarder_roles?.filter((v) => !_.isEmpty(v))?.map((v) => v?.name)?.join('、') : '--' }}</span>
                                    </div>
                                </div>
                                <div class="flex">
                                    <div class="basis-0 grow">
                                        <span>備註：</span>
                                        <span>{{ !_.isEmpty(it?.remark) ? it?.remark : '--' }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Detail>
                </TransitionGroup>
            </div>
            <Paginator :api-paginator="boarderPaginator"></Paginator>
        </div>
        <BoarderSwapPopUp ref="boarderSwapPopUp" @on-swapped="boarderPaginator?.reload()"></BoarderSwapPopUp>
        <BoarderEditPopUp ref="boarderEditPopUp" @on-saved="boarderPaginator?.reload()"></BoarderEditPopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { BoarderPaginator } from '~/composables/api/boarder';
    import { ProjectsCaller } from '~/composables/api/share';
    import _ from 'lodash';

    const { setFieldValue, values } = useForm<{ selectedProjectId?: number }>();

    const boarderSwapPopUp = ref();
    const boarderEditPopUp = ref();

    const boarderPaginator = new BoarderPaginator({ immediate: false });
    const { data: boarderList } = boarderPaginator;
    const projectsCaller = new ProjectsCaller()
    .success((v) => setFieldValue('selectedProjectId', v?.data?.[0]?.id));
    const { data: projectList } = projectsCaller;

    boarderPaginator?.bind('project_id', toRef(values, 'selectedProjectId'));
</script>