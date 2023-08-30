<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] max-h-[80%] text-sm bg-white rounded">
        <div class="flex w-full flex-col p-3 gap-2 overflow-auto lg:p-5">
            <div class="text-base font-bold">確認刪除此筆資料？</div>
            <div class="flex flex-col">
                <div>{{ `名稱：${checkValueEmpty(boarderStatus?.name)}` }}</div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-red-500" @click="onSubmit">
            確認並刪除
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { BoarderStatusCaller, deleteBoarderStatus } from '~/composables/api/boarderStatus';
    import _ from 'lodash';

    interface Emits {
        (e: 'onDeleted'): void;
    }
    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);

    const popUp = ref();
    const visible = ref(false);

    const boarderStatusCaller = new BoarderStatusCaller();
    const { data: boarderStatus } = boarderStatusCaller;

    const onSubmit = async () => {
        const boaderStatus = boarderStatusCaller?.data?.value;

        await deleteBoarderStatus(boaderStatus?.id!);

        toastNotifier?.success('刪除成功');
        emits('onDeleted');
        close();
    };

    const show = async (boarderStatusId: number) => {
        boarderStatusCaller.id = boarderStatusId;
        boarderStatusCaller?.reload();

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>