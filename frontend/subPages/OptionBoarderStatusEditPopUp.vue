<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] bg-gray-500 rounded">
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
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-gray-600" @click="onSubmit">
            儲存
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { BoarderStatusCaller, updateBoarderStatus } from '~/composables/api/boarderStatus';
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

    const boarderStatusCaller = new BoarderStatusCaller();

    const onSubmit = handleSubmit(async (data) => {
        const boarderStatus = boarderStatusCaller?.data?.value;

        await updateBoarderStatus({
            id: boarderStatus?.id!,
            name: data?.name,
        });

        toastNotifier?.success('儲存成功');
        emits('onSaved');
        close();
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const show = async (boarderStatusId: number) => {
        boarderStatusCaller.id = boarderStatusId;
        boarderStatusCaller?.reload();

        await boarderStatusCaller?.wait();
        const boarderStatus = boarderStatusCaller?.data?.value;

        setFieldValue('name', boarderStatus?.name);

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>