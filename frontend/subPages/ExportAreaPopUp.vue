<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] text-sm bg-white rounded">
        <div class="flex-1 flex flex-col w-full p-3 gap-2 lg:p-5 lg:flex-row overflow-auto">
            <div class="flex flex-1 flex-col gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span class="text-red-500">*</span>
                    <span>樓層：</span>
                </div>
                <div class="flex-1 text-black text-xs">
                    <Select name="floor" placeholder="樓層"
                    :options="floorList" :option-key="'floor'" :option-value="'floor'"
                    class="w-full rounded border"/>
                </div>
            </div>
            <div class="flex flex-1 flex-col gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span class="text-red-500">*</span>
                    <span>房型：</span>
                </div>
                <div class="flex-1 text-black text-xs">
                    <Select name="room_type" placeholder="房型"
                    :options="roomTypeList" :option-key="'type'" :option-value="'type'"
                    class="w-full rounded border"/>
                </div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-gray-600" @click="onSubmit">
            匯出
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { BoardersCaller, BunksCaller } from '~/composables/api/share';
    import { ExportCaller } from '~/composables/api/export';
    import { createAreaSheet } from '~/src/export';
    import * as yup from 'yup';
    import ExcelJS from 'exceljs';
    import _ from 'lodash';

    interface Emits {
        (e: 'onExported'): void;
    }

    const schema = yup.object().shape({
        floor: yup.string().required(),
        room_type: yup.string().required(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { values, handleSubmit, setFieldValue } = useForm({ validationSchema: schema });

    const popUp = ref();
    const visible = ref(false);

    const bunksCaller = new BunksCaller();
    const { data: bunkList } = bunksCaller;
    const boardersCaller = new BoardersCaller({ immediate: false });

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

    const onSubmit = handleSubmit(async (data) => {
        try {
            const projectId = boardersCaller.queries.value?.project_id;
            const exportCaller = new ExportCaller({ immediate: false });
            const { data: exportList } = exportCaller;
            exportCaller?.withQuery('project_id', projectId);
            
            await exportCaller?.wait();

            const exportBoarderList = exportList?.value?.filter(({ boarder: { project_bunk: bunk } }) =>bunk ?.floor == values?.floor && bunk?.room_type == values?.room_type);
            const workbook = new ExcelJS.Workbook();
            
            createAreaSheet(workbook, exportBoarderList ?? []);
            download(workbook, `${values?.floor}${values?.room_type}_${Date.now()}`);
            
            toastNotifier?.success('匯出成功');
            emits('onExported');
            close();
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const download = async (workbook: ExcelJS.Workbook, fileName: string) => {
        workbook.xlsx.writeBuffer().then((content) => {
            const link = document.createElement('a');
            const blobData = new Blob([content], {
                type: 'application/vnd.ms-excel;charset=utf-8;',
            });
            link.download = `${fileName}.xlsx`;
            link.href = URL.createObjectURL(blobData);
            link.click();
            document.removeChild(link);
        });
    }

    const show = async (projectId: number) => {
        if (projectId != boardersCaller?.queries?.value?.project_id) {
            boardersCaller.withQuery('project_id', projectId);
        }
        else {
            boardersCaller?.reload();
        }
        await boardersCaller?.wait();

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>