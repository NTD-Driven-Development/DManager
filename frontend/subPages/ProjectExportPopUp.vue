<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center max-w-[80%] bg-white rounded">
        <div class="flex-1 flex flex-col w-full p-3 gap-2 lg:p-5 overflow-auto">
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span class="text-red-500">*</span>
                    <span>選擇項目：</span>
                </div>
                <div class="flex-1 text-black text-xs">
                    <Select name="project_id" placeholder="請選擇項目" class="w-full rounded border"
                    :options="projectList" option-key="id" option-value="name"/>
                </div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-gray-500" @click="onSubmit">
            匯出
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { ExportCaller } from '~/composables/api/export';
    import { ProjectsCaller } from '~/composables/api/share';
    import Papa from 'papaparse';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onExported'): void;
    }

    const schema = yup.object().shape({
        project_id: yup.number().required(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { handleSubmit, setFieldValue } = useForm({ validationSchema: schema });

    const popUp = ref();
    const visible = ref(false);

    const projectsCaller = new ProjectsCaller()
    .success((v) => setFieldValue('project_id', v?.data?.[0]?.id));
    const { data: projectList } = projectsCaller;

    const onSubmit = handleSubmit(async (data) => {
        const projectId = data?.project_id;
        const filename = `${projectList?.value?.find((v) => v?.id == projectId)?.name}_${Date.now()}`;
        
        const csv = await exportCSV(projectId);
        download(csv, filename);

        toastNotifier?.success('匯出成功');
        emits('onExported');
        close();
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const exportCSV = async (projectId: number) => {
        const exportCaller = new ExportCaller({ immediate: false });
        const { data: exportList } = exportCaller;
        exportCaller?.withQuery('project_id', projectId);

        await exportCaller.wait();

        const boarders = exportList?.value?.map((v) => [
            v?.boarder?.project_bunk?.floor,
            v?.boarder?.project_bunk?.room_type,
            v?.boarder?.project_bunk?.room_no,
            v?.boarder?.project_bunk?.bed,
            v?.boarder?.name,
            v?.boarder?.class?.name,
            v?.boarder?.sid,
            v?.boarder?.boarder_roles?.map((v) => v?.name)?.join('、'),
            v?.boarder?.phone,
            v?.boarder?.remark,
        ])

        const csv = Papa.unparse([
            ['樓', '區', '室', '床', '姓名', '班級', '學號', '身分別', '電話', '備註'],
            ...(boarders as [][]),
        ]);
        return csv;
    }

    const download = (data: string, fileName: string) => {
        const link = document.createElement('a');
        const blobData = new Blob([data], {
            type: 'text/csv',
        });
        link.download = `${fileName}.csv`;
        link.href = URL.createObjectURL(blobData);
        link.click();
        document.removeChild(link);
    }

    const show = () => {
        projectsCaller.reload();
        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>