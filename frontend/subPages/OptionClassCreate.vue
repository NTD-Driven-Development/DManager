<template>
    <div class="flex flex-col overflow-hidden rounded text-sm bg-white">
        <div class="flex flex-1 flex-col p-3 gap-2 border border-gray-300 lg:p-5">
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span class="text-red-500">*</span>
                    <span>名稱：</span>
                </div>
                <div class="flex-1 text-black text-xs">
                    <Input name="name" placeholder="請輸入名稱" class="w-full rounded border"/>
                </div>
            </div>
        </div>
        <button class="flex items-center justify-center p-2 bg-gray-600 text-white" @click="onSubmit">
            新增班級
        </button>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { createClass } from '~/composables/api/class';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onCreated'): void,
    }

    const schema = yup.object().shape({
        name: yup.string().required(),
    });

    const emits = defineEmits<Emits>();

    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });
    const toastNotifier = inject(ToastNotifierKey);

    const onSubmit = handleSubmit(async (data) => {
        try {            
            await createClass({
                name: data?.name,
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