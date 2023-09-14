<template>
    <div class="fixed flex flex-col gap-3 p-3 w-full min-w-full max-w-full h-full min-h-full max-h-full"
    @mousemove="onMouseMove">
        <div class="absolute flex flex-col w-fit gap-3 p-3 bg-black/60 boarder shadow rounded" v-show="isSettingVisable">
            <!-- 選擇項目 -->
            <div class="flex flex-col gap-1">
                <div class="text-sm text-white">選擇項目：</div>
                <Select name="selectedProjectId" class="shadow rounded border text-xs max-w-md"
                :options="projectList" option-key="id" option-value="name"></Select>
            </div>
            <!-- 選擇身分別 -->
            <div class="flex flex-col gap-1">
                <div class="text-sm text-white">選擇住宿狀態：</div>
                <div class="h-full w-full text-black text-xs">
                    <CheckBoxes name="boarder_status_ids" :items="boarderStatusList" v-slot="{ item, checked }" item-key="id" class="flex flex-wrap gap-2">
                        <button type="button" class="text-xs px-2 py-1 border rounded" :class="checked ? 'text-white bg-gray-500' : 'bg-white'">
                            {{ item?.name }}
                        </button>
                    </CheckBoxes>
                </div>
            </div>
        </div>
        <!-- 內容 -->
        <div class="grid grid-cols-[repeat(9,_minmax(0,_1fr))] grid-rows-[repeat(14,_minmax(0,_1fr))] 
        lg:grid-cols-[repeat(16,_minmax(0,_1fr))] lg:grid-rows-[repeat(9,_minmax(0,_1fr))] flex-col w-full h-full p-3 lg:py-6 lg:px-10">
            <div class="row-span-1 col-span-full flex items-center justify-center lg:row-span-2">
                <div class="py-2 sm:text-3xl md:text-5xl lg:text-6xl lg:py-6 xl:text-7xl xl:pb-10">國立臺中科技大學男生宿舍人數概況表</div>
            </div>
            <div class="flex items-center row-span-5 col-span-full bg-gray-3 p-4 lg:col-span-6">
                <div class="-outline-offset-1 outline outline-white w-full sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl">
                    <div class="grid grid-cols-2">
                        <div class="border border-black p-2 text-center lg:p-4">1F</div>
                        <div class="border border-black p-2 text-center lg:p-4">{{ _1E }}</div>
                    </div>
                    <div class="grid grid-cols-2">
                        <div class="border border-black p-2 text-center lg:p-4">2F</div>
                        <div class="border border-black p-2 text-center lg:p-4">{{ _2C + _2D + _2E }}</div>
                    </div>
                    <div class="grid grid-cols-2">
                        <div class="border border-black p-2 text-center lg:p-4">3F</div>
                        <div class="border border-black p-2 text-center lg:p-4">{{ _3C + _3D + _3E }}</div>
                    </div>
                    <div class="grid grid-cols-2">
                        <div class="border border-black p-2 text-center lg:p-4">4F</div>
                        <div class="border border-black p-2 text-center lg:p-4">{{ _4C + _4D + _4E }}</div>
                    </div>
                </div>
            </div>
            <div class="row-span-6 col-span-full lg:col-start-8 lg:col-span-9">
                <div class="grid grid-rows-5 -outline-offset-1 outline outline-white w-full h-full sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl">
                    <div class="grid grid-cols-5 items-center justify-center">
                        <div class="flex items-center justify-center w-full h-full border-b border-black p-2 text-center lg:p-4"></div>
                        <div class="flex items-center justify-center w-full h-full border-b border-black p-2 text-center lg:p-4">1F</div>
                        <div class="flex items-center justify-center w-full h-full border-b border-black p-2 text-center lg:p-4">2F</div>
                        <div class="flex items-center justify-center w-full h-full border-b border-black p-2 text-center lg:p-4">3F</div>
                        <div class="flex items-center justify-center w-full h-full border-b border-black p-2 text-center lg:p-4">4F</div>
                    </div>
                    <div class="grid grid-cols-5">
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            C
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            --
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _2C }}
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _3C }}
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _4C }}
                        </div>
                    </div>
                    <div class="grid grid-cols-5">
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            D
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            --
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _2D }}
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _3D }}
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _4D }}
                        </div>
                    </div>
                    <div class="grid grid-cols-5">
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            E
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _1E }}
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _2E }}
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _3E }}
                        </div>
                        <div class="flex items-center justify-center w-full h-full border border-black p-2 text-center lg:p-4">
                            {{ _4E }}
                        </div>
                    </div>
                    <div class="grid grid-cols-5">
                        <div class="flex items-center justify-center w-full h-full border-t border-black p-2 text-center lg:p-4">
                            {{ '共' }}
                        </div>
                        <div class="flex col-span-3 items-center justify-center w-full h-full border-t border-black p-2 text-center lg:p-4">
                            {{ _1E + _2C + _2D + _2E + _3C + _3D + _3E + _4C + _4D + _4E }}
                        </div>
                        <div class="flex items-center justify-center w-full h-full border-t border-black p-2 text-center lg:p-4">
                            {{ '人' }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex row-span-2 col-span-full gap-1 lg:col-span-6 flex-col sm:text-2xl
            lg:text-3xl lg:py-6 lg:px-4 xl:text-4xl xl:gap-5 xl:px-6 xl:py-10">
                <div class="flex items-center">
                    <div>{{ `輪值大隊：` }}</div>
                </div>
                <div class="flex items-center">
                    <div>{{ `寢室分機：` }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { ProjectsCaller, BoarderStatusesCaller } from '~/composables/api/share';
    import { EventSourcePolyfill } from 'event-source-polyfill';
    import _ from 'lodash';

    interface Item {
        id: string,
        name: string,
        floor: number,
        room_type: string,
        room_no: number,
        bed: number,
        boarder_status_id: number,   
    }

    const { setFieldValue, values } = useForm<{ selectedProjectId?: number, boarder_status_ids?: number[] }>();

    const isSettingVisable = ref(false);
    const items = ref<Item[]>();
    let mouseMoveTimeout: NodeJS.Timeout;
    let es: EventSourcePolyfill;

    const toastNotifier = inject(ToastNotifierKey);

    const projectsCaller = new ProjectsCaller()
    .success((v) => setFieldValue('selectedProjectId', v?.data?.[0]?.id));
    const { data: projectList } = projectsCaller;
    const boarderStatusesCaller = new BoarderStatusesCaller()
    .success((v) => setFieldValue('boarder_status_ids', v?.data?.map((v) => v?.id)));
    const { data: boarderStatusList } = boarderStatusesCaller;

    const _1E = computed(() => {
        return items?.value?.filter((v) => v?.floor == 1 && v?.room_type == 'E' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    const _2C = computed(() => {
        return items?.value?.filter((v) => v?.floor == 2 && v?.room_type == 'C' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    const _2D = computed(() => {
        return items?.value?.filter((v) => v?.floor == 2 && v?.room_type == 'D' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    const _2E = computed(() => {
        return items?.value?.filter((v) => v?.floor == 2 && v?.room_type == 'E' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    const _3C = computed(() => {
        return items?.value?.filter((v) => v?.floor == 3 && v?.room_type == 'C' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    const _3D = computed(() => {
        return items?.value?.filter((v) => v?.floor == 3 && v?.room_type == 'D' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    const _3E = computed(() => {
        return items?.value?.filter((v) => v?.floor == 3 && v?.room_type == 'E' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    const _4C = computed(() => {
        return items?.value?.filter((v) => v?.floor == 4 && v?.room_type == 'C' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    const _4D = computed(() => {
        return items?.value?.filter((v) => v?.floor == 4 && v?.room_type == 'D' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    const _4E = computed(() => {
        return items?.value?.filter((v) => v?.floor == 4 && v?.room_type == 'E' && includesBoarderStatus(v?.boarder_status_id))?.length ?? 0;
    });

    watch(() => values?.selectedProjectId, (n) => {
        if (es) {
            es.close();
        }

        toastNotifier?.warning('狀態已變更，嘗試連線中');
        es = new EventSourcePolyfill(`/api/sse/boarders?project_id=${n}`);
        es?.addEventListener('open', (ev) => {
            toastNotifier?.success('已取得連線');
        });
        es?.addEventListener('error', (ev) => {
            toastNotifier?.error(ev?.type);
        });
        es?.addEventListener('message', (ev) => {
            items.value = JSON.parse(ev.data);
        });
    });

    const includesBoarderStatus = (boarderStatusId: number) => {
        return values?.boarder_status_ids?.includes(boarderStatusId);   
    }

    const onMouseMove = _.throttle(() => {
        clearTimeout(mouseMoveTimeout);
        isSettingVisable.value = true;
        mouseMoveTimeout = setTimeout(() => {
            isSettingVisable.value = false;
        }, 2000);
    }, 1300);
</script>