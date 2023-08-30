<template>
    <div class="flex flex-col overflow-hidden rounded text-sm bg-white">
        <form class="flex flex-1 flex-col p-3 gap-2 border border-gray-300 lg:p-5">
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>編號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="code" placeholder="請輸入編號" class="w-full rounded border"/>
                    </div>
                </div>
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>點數：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="point" placeholder="請輸入點數" class="w-full rounded border"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span class="text-red-500">*</span>
                    <span>事由：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="reason" placeholder="請輸入事由" class="w-full rounded h-full min-h-[80px] max-h-[160px] border"/>
                </div>
            </div>
        </form>
        <button class="flex items-center justify-center p-2 bg-gray-600 text-white" @click="onSubmit">
            新增加扣點規則
        </button>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { createPointRule } from '~/composables/api/point';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onCreated'): void,
    }

    const schema = yup.object().shape({
        code: yup.string().required(),
        reason: yup.string().required(),
        point: yup.string().required(),
    });

    const emits = defineEmits<Emits>();

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });
    const toastNotifier = inject(ToastNotifierKey);

    const onSubmit = handleSubmit(async (data) => {
        try {            
            await createPointRule({
                code: data?.code,
                reason: data?.reason,
                point: data?.point,
            });
            
            toastNotifier?.success('新增成功');
            emits('onCreated');
            resetForm();
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });
</script>