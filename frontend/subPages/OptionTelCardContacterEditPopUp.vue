<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] bg-white rounded">
        <div class="flex-1 flex flex-col w-full p-4 gap-2 lg:p-6 overflow-auto">
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 text-sm shrink-0">
                        <span class="text-red-500">*</span>
                        <span>名稱：</span>
                    </div>
                <div class="flex-1 text-black border text-xs">
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
    import { TelCardContacterCaller, updateTelCardContacter } from '~/composables/api/telCard';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onEdited'): void;
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

    const telCardContacterCaller = new TelCardContacterCaller();

    const onSubmit = handleSubmit(async (data) => {
        try {
            const telCardContacter = telCardContacterCaller?.data?.value;

            await updateTelCardContacter({
                id: telCardContacter?.id!,
                name: data?.name,
            });

            toastNotifier?.success('儲存成功');
            emits('onEdited');
            close();
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const show = async (telCardContacterId: number) => {
        telCardContacterCaller.id = telCardContacterId;
        telCardContacterCaller?.reload();

        await telCardContacterCaller?.wait();
        const telCardContacter = telCardContacterCaller?.data?.value;

        setFieldValue('name', telCardContacter?.name);

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>