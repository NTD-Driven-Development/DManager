<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-6/12 max-w-[80%] max-h-[80%] text-sm bg-white rounded">
        <form class="flex w-full flex-col p-3 gap-2 overflow-auto lg:p-5">
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span class="text-red-500">*</span>
                    <span>標題：</span>
                </div>
                <div class="flex-1 text-black text-xs">
                    <Input name="title" placeholder="請輸入標題" class="w-full rounded border"/>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span class="text-red-500">*</span>
                    <span>敘述：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="description" placeholder="請輸入敘述" class="w-full rounded h-full min-h-[80px] max-h-[160px] border"/>
                </div>
            </div>
        </form>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-gray-600" @click="onSubmit">
            儲存
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { BoarderNoteCaller, updateBoarderNote } from '~/composables/api/note';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onEdited'): void;
    }

    const schema = yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { handleSubmit, setFieldValue } = useForm({ validationSchema: schema });

    const popUp = ref();
    const visible = ref(false);

    const boarderNoteCaller = new BoarderNoteCaller();

    const onSubmit = handleSubmit(async (data) => {
        try {
            const boaderNote = boarderNoteCaller?.data?.value;

            await updateBoarderNote({
                id: boaderNote?.id!,
                title: data?.title,
                description: data?.description,
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

    const show = async (boarderNoteId: number) => {
        boarderNoteCaller.id = boarderNoteId;
        boarderNoteCaller?.reload();

        await boarderNoteCaller?.wait();

        const boaderNote = boarderNoteCaller?.data?.value;

        setFieldValue('title', boaderNote?.title);
        setFieldValue('description', boaderNote?.description);

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>