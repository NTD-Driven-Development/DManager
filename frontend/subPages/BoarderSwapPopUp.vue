<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] text-sm bg-white rounded">
        <div class="flex-1 flex flex-col w-full p-3 gap-2 lg:p-5 lg:flex-row overflow-auto">
            <div class="flex flex-col justify-center w-full gap-1.5">
                <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>床位1：</span>
                </div>
                <div class="flex-1 text-black text-xs">
                    <Input name="bunk1" placeholder="請輸入床位1" class="w-full rounded border"/>
                </div>
                <div class="flex flex-col gap-1 text-xs">
                    <div>
                        <span>姓名：</span>
                        <span>{{ !_.isEmpty(boarder1?.name) ? boarder1?.name : '--' }}</span>
                    </div>
                    <div>
                        <span>班級：</span>
                        <span>{{ !_.isEmpty(boarder1?.class?.name) ? boarder1?.class?.name : '--' }}</span>
                    </div>
                    <div>
                        <span>學號：</span>
                        <span>{{ !_.isEmpty(boarder1?.sid) ? boarder1?.sid : '--' }}</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-1.5">
                <div class="flex gap-0.5 shrink-0">
                    <span class="text-red-500">*</span>
                    <span>床位2：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <Input name="bunk2" placeholder="請輸入床位2" class="w-full rounded border"/>
                </div>
                <div class="flex flex-col gap-1 text-xs">
                    <div>
                        <span>姓名：</span>
                        <span>{{ !_.isEmpty(boarder2?.name) ? boarder2?.name : '--' }}</span>
                    </div>
                    <div>
                        <span>班級：</span>
                        <span>{{ !_.isEmpty(boarder2?.class?.name) ? boarder2?.class?.name : '--' }}</span>
                    </div>
                    <div>
                        <span>學號：</span>
                        <span>{{ !_.isEmpty(boarder2?.sid) ? boarder2?.sid : '--' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-gray-600" @click="onSubmit">
            交換床位
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { BoardersCaller } from '~/composables/api/share';
    import { swapProjectBunk } from '~/composables/api/project';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onSwapped'): void;
    }

    const schema = yup.object().shape({
        bunk1: yup.string().required(),
        bunk2: yup.string().required(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { values, handleSubmit } = useForm({ validationSchema: schema });

    const popUp = ref();
    const visible = ref(false);

    const boardersCaller = new BoardersCaller({ immediate: false });

    const boarder1 = computed(() => getBoarder(values?.bunk1));
    const boarder2 = computed(() => getBoarder(values?.bunk2));

    const onSubmit = handleSubmit(async (data) => {
        const projectId = boardersCaller.queries.value?.project_id;

        await swapProjectBunk(projectId!, {
            origin_bunk_id: boarder1.value?.project_bunk?.id!,
            origin_boarder_id: boarder1.value?.id!,
            swap_bunk_id: boarder2.value?.project_bunk?.id!,
            swap_boarder_id: boarder2.value?.id!,
        });

        toastNotifier?.success('交換成功');
        emits('onSwapped');
        close();
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const getBoarder = (stringlistBunk: string) => {
        const bunk = toBunk(stringlistBunk);
        const boaders = boardersCaller?.data?.value;

        if (!bunk) 
            return null;

        return boaders?.find(({ project_bunk: v }) => v?.floor == bunk?.floor && v?.room_type == bunk?.room_type && v?.room_no == bunk?.room_no && v?.bed == bunk?.bed);
    }

    const show = async (projectId: number) => {
        boardersCaller.withQuery('project_id', projectId);

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>