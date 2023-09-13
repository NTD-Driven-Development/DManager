<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] max-h-[80%] text-sm bg-white rounded">
        <div class="flex w-full flex-col p-3 gap-2 overflow-auto lg:p-5">
            <div class="text-base font-bold">確認刪除此筆資料？</div>
            <div class="flex flex-col">
                <div>{{ `姓名：${checkValueEmpty(user?.name)}` }}</div>
                <div>{{ `學號：${checkValueEmpty(user?.sid)}` }}</div>
                <div>{{ `電子郵件：${checkValueEmpty(user?.email)}` }}</div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-red-500" @click="onSubmit">
            確認並刪除
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { UserCaller, deleteUser } from '~/composables/api/user';
    import _ from 'lodash';

    interface Emits {
        (e: 'onDeleted'): void;
    }
    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);

    const popUp = ref();
    const visible = ref(false);

    const userCaller = new UserCaller();
    const { data: user } = userCaller;

    const onSubmit = async () => {
        try {
            const user = userCaller?.data?.value;

            await deleteUser(user?.id!);

            toastNotifier?.success('刪除成功');
            emits('onDeleted');
            close();
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    };

    const show = async (userId: number) => {
        userCaller.id = userId;
        userCaller?.reload();

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>