<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center max-w-[80%] bg-gray-500 rounded">
        <div class="flex-1 flex flex-col w-full p-4 gap-2 lg:p-6 overflow-auto">
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>名稱：</span>
                    </div>
                <div class="flex-1 text-black text-xs">
                    <Input name="name" placeholder="請輸入名稱" class="w-full rounded"/>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0 text-white">
                    <span>備註：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="remark" placeholder="請輸入備註" class="w-full rounded h-full min-h-[80px] max-h-[200px]"/>
                </div>
            </div>
        </div>
        <button class="shrink-0 w-full p-2 text-white bg-gray-600" @click="onSubmit">
            儲存
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { ProjectCaller, updateProject } from '~/composables/api/project';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onSaved'): void;
    }

    const schema = yup.object().shape({
        name: yup.string().required(),
        remark: yup.string().nullable(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { handleSubmit, setFieldValue } = useForm({ validationSchema: schema });

    const popUp = ref();
    const visible = ref(false);

    const projectCaller = new ProjectCaller();

    const onSubmit = handleSubmit(async (data) => {
        const project = projectCaller?.data?.value;

        await updateProject({
            id: project?.id!,
            name: data?.name,
            remark: data?.remark,
        });

        toastNotifier?.success('儲存成功');
        emits('onSaved');
        close();
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const show = async (project_id: number) => {
        projectCaller.id = project_id;
        projectCaller?.reload();

        await projectCaller?.wait();
        const project = projectCaller?.data?.value;

        setFieldValue('name', project?.name);
        setFieldValue('remark', project?.remark);

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>