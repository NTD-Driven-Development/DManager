<template>
    <PopUp ref="popUp" containerClass="flex flex-col overflow-auto items-center w-4/5 max-w-md p-4 gap-6 bg-white rounded sm:p-5">
        <div class="flex w-full items-center">
            <div class="flex flex-1 justify-center relative -translate-x-1/2 -right-1/2">
                <div class="text-xl sm:text-2xl">{{ '更改密碼' }}</div>
            </div>
        </div>
        <form class="flex flex-col justify-center gap-4 w-full">
            <!-- 舊密碼 -->
            <div class="grid grid-cols-[minmax(100px,_2fr)_6fr] gap-x-3 sm:gap-x-4 lg:grid-cols-[120px_2fr]">
                <Input name="old_password" type="password" autocomplete="on" class="col-span-full overflow-auto rounded border text-xs sm:text-sm" placeholder="請輸入舊密碼"/>
            </div>
            <!-- 新密碼 -->
            <div class="grid grid-cols-[minmax(100px,_2fr)_6fr] gap-x-3 sm:gap-x-4 lg:grid-cols-[120px_2fr]">
                <Input name="new_password" type="password" autocomplete="on" class="col-span-full overflow-auto rounded border text-xs sm:text-sm" placeholder="請輸入新密碼"/>
            </div>
            <!-- 新密碼確認 -->
            <div class="grid grid-cols-[minmax(100px,_2fr)_6fr] gap-x-3 sm:gap-x-4 lg:grid-cols-[120px_2fr]">
                <Input name="re_new_password" type="password" autocomplete="on" class="col-span-full overflow-auto rounded border text-xs sm:text-sm" placeholder="請重複輸入新密碼"/>
            </div>
        </form>
        <div class="flex items-center justify-center gap-3 sm:gap-6">
            <button type="button" class="flex items-center justify-center px-10 py-2 border border-secondary-500 rounded"
            @click="resetForm(); popUp?.close();">取消</button>
            <button type="button" class="flex items-center justify-center px-10 py-2 border border-secondary-500 text-white bg-gray-600 rounded"
            @click="onSubmit()">更改</button>
        </div>
    </PopUp>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { useAuthStore } from '~/stores/auth';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onPasswordChanged'): void;
    }

    const schema = yup.object().shape({
        old_password: yup.string().required(),
        new_password: yup.string().required(),
        re_new_password: yup.string().oneOf([yup.ref('new_password')]).required(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { handleSubmit, resetForm } = useForm({ validationSchema: schema });
    const authStore = useAuthStore();
    const { changePassword } = authStore;

    const popUp = ref();
    const visible = ref(false);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await changePassword({
                old_password: data?.old_password,
                new_password: data?.new_password,
            });

            toastNotifier?.success('更改成功');
            emits('onPasswordChanged');
            resetForm();
            close();
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const show = async () => {
        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>