<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] max-h-[80%] text-sm bg-white rounded">
        <div class="flex w-full flex-col p-3 gap-2 overflow-auto lg:p-5">
            <div class="text-base font-bold">確認刪除此筆資料？</div>
            <div class="flex flex-col">
                <div>{{ `項目：${checkValueEmpty(boarder?.project?.name)}` }}</div>
                <div>{{ `樓寢床：${checkValueEmpty(boarder?.project_bunk, (v) => toStringlish(v))}` }}</div>
                <div>{{ `班級：${checkValueEmpty(boarder?.class?.name)}` }}</div>
                <div>{{ `姓名：${checkValueEmpty(boarder?.name)}` }}</div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-red-500" @click="onSubmit">
            確認並刪除
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { BoarderCaller, deleteBoarder } from '~/composables/api/boarder';
    import _ from 'lodash';

    interface Emits {
        (e: 'onDeleted'): void;
    }
    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);

    const popUp = ref();
    const visible = ref(false);

    const boarderCaller = new BoarderCaller();
    const { data: boarder } = boarderCaller;

    const onSubmit = async () => {
        const boader = boarderCaller?.data?.value;

        await deleteBoarder(boader?.id!);

        toastNotifier?.success('刪除成功');
        emits('onDeleted');
        close();
    };

    const show = async (boarderId: string) => {
        boarderCaller.id = boarderId;
        boarderCaller?.reload();

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>