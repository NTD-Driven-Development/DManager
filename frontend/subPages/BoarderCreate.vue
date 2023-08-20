<template>
    <div class="flex flex-col bg-gray-500 overflow-hidden rounded text-sm">
        <form class="flex flex-1 flex-col p-3 gap-1">
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>樓層：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="floor" placeholder="樓層"
                        :options="floorList" :option-key="'floor'" :option-value="'floor'"
                        class="w-full rounded"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>房型：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="room_type" placeholder="房型"
                        :options="roomTypeList" :option-key="'type'" :option-value="'type'"
                        class="w-full rounded"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>房別：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="room_no" placeholder="房別"
                        :options="roomNoList" :option-key="'no'" :option-value="'no'"
                        class="w-full rounded"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>床號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="bed" placeholder="床號"
                        :options="bedList"
                        class="w-full rounded"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>學號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="sid" placeholder="請輸入學號" class="w-full rounded"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>姓名：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="name" placeholder="請輸入姓名" class="w-full rounded"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>班級：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="class_id" placeholder="請選擇班級"
                        :options="classList" :option-key="'id'" :option-value="'name'"
                        class="w-full rounded"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>住宿狀態：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="boarder_status_id" placeholder="請選擇住宿狀態"
                        :options="boarderStatusList" :option-key="'id'" :option-value="'name'"
                        class="w-full rounded"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0 text-white">
                    <span>備註：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="remark" placeholder="請輸入備註" class="w-full rounded h-full min-h-[80px] max-h-[160px]"/>
                </div>
            </div>
        </form>
        <button class="flex items-center justify-center p-2 bg-gray-600 text-white" @click="onSubmit">
            新增住宿生
        </button>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { BoarderStatusesCaller, BunksCaller, ClassesCaller } from '~/composables/api/share';
    import { createBoarder } from '~/composables/api/boarder';
    import { Project } from '~/src/model';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Props {
        project: Project,
    }

    interface Emits {
        (e: 'onCreated'): void,
    }

    const schema = yup.object().shape({
        floor: yup.number().required(),
        room_type: yup.string().required(),
        room_no: yup.number().required(),
        bed: yup.number().required(),
        sid: yup.number().required(),
        name: yup.string().required(),
        class_id: yup.number().required(),
        boarder_status_id: yup.number().required(),
        remark: yup.string().nullable(),
    });

    const props = defineProps<Props>();
    const emits = defineEmits<Emits>();

    const { handleSubmit, values, setFieldValue } = useForm({ validationSchema: schema });
    const toastNotifier = inject(ToastNotifierKey);

    const bunksCaller = new BunksCaller();
    const { data: bunkList } = bunksCaller;
    const classesCaller = new ClassesCaller()
    .success((v) => setFieldValue('class_id', v?.data?.[0]?.id));
    const { data: classList } = classesCaller;
    const boarderStatusesCaller = new BoarderStatusesCaller()
    .success((v) => setFieldValue('boarder_status_id', v?.data?.[0]?.id));
    const { data: boarderStatusList } = boarderStatusesCaller; 

    const floorList = computed(() => {
        const floorList = bunkList.value ?? [];
        setFieldValue('floor', floorList?.[0]?.floor);
        return floorList;
    });

    const roomTypeList = computed(() => {
        const floor = values?.floor;
        const roomTypeList = bunkList.value?.find((v) => v?.floor == floor)?.rooms ?? [];
        setFieldValue('room_type', roomTypeList?.[0]?.type);
        return roomTypeList;
    });

    const roomNoList = computed(() => {
        const type = values?.room_type;
        const roomNoList = roomTypeList.value?.find((v) => v?.type == type)?.numbers ?? [];
        setFieldValue('room_no', roomNoList?.[0]?.no);
        return roomNoList;
    });

    const bedList = computed(() => {
        const number = values?.room_no;
        const bedList = roomNoList.value?.find((v) => v?.no == number)?.beds ?? [];
        setFieldValue('bed', bedList?.[0]);
        return bedList;
    });

    const onSubmit = handleSubmit(async (data) => {
        try {            
            await createBoarder({
                project_id: props?.project?.id,
                floor: data?.floor,
                room_type: data?.room_type,
                room_no: data?.room_no,
                bed: data?.bed,
                sid: data?.sid,
                name: data?.name,
                class: data?.class,
                boarder_status_id: data?.boarder_status_id,
            });
            toastNotifier?.success('新增成功');
            emits('onCreated');
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });
</script>