<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] text-sm bg-white rounded">
        <div class="flex-1 flex flex-col w-full p-3 gap-2 lg:p-5 lg:flex-row overflow-auto">
            <div class="flex flex-col justify-center w-full gap-1.5">
                <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>床位：</span>
                </div>
                <div class="flex-1 text-black text-xs">
                    <Input name="bunk" placeholder="請輸入床位" class="w-full rounded border"/>
                </div>
                <div class="flex flex-col gap-1 text-xs">
                    <div>
                        <span>姓名：</span>
                        <span>{{ checkValueEmpty(boarder?.name) }}</span>
                    </div>
                    <div>
                        <span>班級：</span>
                        <span>{{ checkValueEmpty(boarder?.class?.name) }}</span>
                    </div>
                    <div>
                        <span>學號：</span>
                        <span>{{ checkValueEmpty(boarder?.sid) }}</span>
                    </div>
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
    import { BoardersCaller } from '~/composables/api/share';
    import { ExportCaller } from '~/composables/api/export';
    import { createBoarderSheet } from '~/src/export';
    import * as yup from 'yup';
    import ExcelJS from 'exceljs';
    import _ from 'lodash';

    interface Emits {
        (e: 'onExported'): void;
    }

    const schema = yup.object().shape({
        bunk: yup.string().required(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { values, handleSubmit } = useForm({ validationSchema: schema });

    const popUp = ref();
    const visible = ref(false);

    const boardersCaller = new BoardersCaller({ immediate: false });

    const boarder = computed(() => {
        const bunk = toBunk(values?.bunk);
        const boaders = boardersCaller?.data?.value;

        if (!bunk) 
            return null;

        return boaders?.find(({ project_bunk: v }) => v?.floor == bunk?.floor && v?.room_type == bunk?.room_type && v?.room_no == bunk?.room_no && v?.bed == bunk?.bed);
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            const projectId = boardersCaller.queries.value?.project_id;
            const exportCaller = new ExportCaller({ immediate: false });
            const { data: exportList } = exportCaller;
            exportCaller?.withQuery('project_id', projectId);
            
            await exportCaller?.wait();

            const exportBoarder = exportList?.value?.find((v) => v?.boarder?.id == boarder?.value?.id);
            const workbook = new ExcelJS.Workbook();

            createBoarderSheet(workbook, exportBoarder!);
            download(workbook, `${toStringlish(exportBoarder?.boarder?.project_bunk!)}_${exportBoarder?.boarder?.name}_${Date.now()}`);
            
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