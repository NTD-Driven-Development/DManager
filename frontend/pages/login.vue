<template>
    <div class="fixed flex flex-col items-center justify-center min-h-full w-full min-w-[320px] gap-3 p-3 sm:p-7 lg:py-10 xl:py-14 bg-gray-100">
        <div class="text-xl font-bold">後台登入</div>
        <div class="flex flex-col w-full max-w-sm rounded-lg bg-white overflow-hidden">
            <form class="flex flex-col w-full gap-3 p-6">
                <div class="flex items-center gap-2 whitespace-nowrap">
                    <div>帳號：</div>
                    <Input name="account" placeholder="請輸入帳號" class="flex-1 min-w-0 p-2 text-sm border rounded outline-gray-500"/>
                </div>
                <div class="flex items-center gap-2 whitespace-nowrap">
                    <div>密碼：</div>
                    <Input name="password" type="password" placeholder="請輸入密碼" class="flex-1 min-w-0 p-2 text-sm border rounded outline-gray-500"/>
                </div>
            </form>
            <button class="flex flex-col items-center w-full px-6 py-2 text-white bg-gray-700" @click="onSubmit">提交</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { useAuthStore } from '~/stores/auth';
    import * as yup from 'yup';

    const authStore = useAuthStore();
    const { login } = authStore;
    const toastNotifier = inject(ToastNotifierKey);

    const schema = yup.object().shape({
        email: yup.string().required(),
        password: yup.string().required(),
    });

    const { handleSubmit } = useForm({ validationSchema: schema });

    const onSubmit = handleSubmit((data) => {
        login({
            email: data?.email,
            password: data?.password,
        })
        .then(() => {
            toastNotifier?.success('登入成功');
            navigateTo('/');
        })
        .catch((error) => {
            showParseError(toastNotifier!, error);
        })
    });
</script>