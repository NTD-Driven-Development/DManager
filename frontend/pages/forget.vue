<template>
    <Title>{{ `忘記密碼 - Dormiday` }}</Title>
    <div class="fixed flex flex-col items-center justify-center min-h-full w-full min-w-[320px] gap-3 p-3 sm:p-7 lg:py-10 xl:py-14 bg-gray-100">
        <div class="text-xl font-bold">忘記密碼</div>
        <div class="flex flex-col w-full max-w-md rounded-lg bg-white overflow-hidden">
            <form class="flex flex-col w-full gap-3 p-6">
                <div class="pb-2">
                    <NuxtLink to="/login" class="px-3 py-2 w-fit rounded text-xs bg-gray-600 text-white">回登入頁</NuxtLink>
                </div>
                <div class="flex items-center gap-2 whitespace-nowrap">
                    <div>電子郵件：</div>
                    <Input name="email" placeholder="請輸入電子郵件" :disabled="step != 0" class="flex-1 min-w-0 p-2 text-sm border rounded outline-gray-500"/>
                    <button class="px-3 py-1 border text-sm" type="button" @click="sendForget()">送出</button>
                    <Icon icon="ic:baseline-check-circle" class="text-green-500" :class="[{ 'invisible': ![1, 2].includes(step) }]"></Icon>
                </div>
                <div class="flex items-center gap-2 whitespace-nowrap">
                    <div>驗證碼：</div>
                    <Input name="token" placeholder="請輸入驗證碼" class="flex-1 min-w-0 p-2 text-sm border rounded outline-gray-500"/>
                    <button class="px-3 py-1 border text-sm" type="button" @click="sendVerifyForget()">驗證</button>
                    <Icon icon="ic:baseline-check-circle" class="text-green-500" :class="[{ 'invisible': ![2].includes(step) }]"></Icon>
                </div>
                <div class="flex items-center gap-2 whitespace-nowrap" v-if="step == 2">
                    <div>新密碼：</div>
                    <Input name="password" type="password" placeholder="請輸入密碼" class="flex-1 min-w-0 p-2 text-sm border rounded outline-gray-500"
                    @keyup.enter="sendResetPassWord()"/>
                    <Icon icon="ic:baseline-check-circle" class="text-green-500" :class="[{ 'invisible': ![3].includes(step) }]"></Icon>
                </div>
            </form>
            <button class="flex flex-col items-center w-full px-6 py-2 text-white bg-gray-700" :disabled="step != 2" type="button"
            @click="sendResetPassWord()">提交</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { useAuthStore } from '~/stores/auth';
    import _ from 'lodash';

    const { values } = useForm();
    const authStore = useAuthStore();
    const { forget, verifyForget, resetPassword } = authStore;
    const toastNotifier = inject(ToastNotifierKey);

    const step = ref(0);

    const sendForget = async () => {
        try {            
            await forget({
                email: values?.email,
            });
            toastNotifier?.success('送出成功');
            step.value = 1;
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }

    const sendVerifyForget = async () => {
        try {            
            await verifyForget({
                email: values?.email,
                token: values?.token,
            });
            toastNotifier?.success('驗證成功');
            step.value = 2;
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }

    const sendResetPassWord = async () => {
        try {            
            await resetPassword({
                password: values?.password,
            });
            toastNotifier?.success('重設成功，2秒後跳轉至後台');
            step.value = 3;
            setTimeout(() => {
                navigateTo('/boarders');
            }, 2000);
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }
</script>