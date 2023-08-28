<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] max-h-[80%] bg-gray-500 rounded">
        <form class="flex w-full flex-col p-3 gap-1 overflow-auto">
            <div class="flex justify-center w-full gap-2">
                <div class="aspect-video w-full bg-gray-400"></div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>姓名：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="name" placeholder="請輸入姓名" class="w-full rounded"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span>學號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="sid" placeholder="請輸入學號" class="w-full rounded"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>班級：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="class_id" placeholder="請選擇班級"
                        :options="[{ id: 0, name: '暫無' }, ...classList ?? []]" :option-key="'id'" :option-value="'name'" init-value="0"
                        class="w-full rounded"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span class="text-red-500">*</span>
                        <span>住宿狀態：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="boarder_status_id" placeholder="請選擇住宿狀態"
                        :options="boarderStatusList" :option-key="'id'" :option-value="'name'"
                        class="w-full rounded"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span>電話：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="phone" placeholder="請輸入電話" class="w-full rounded"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span>生日：</span>
                    </div>
                    <div class="flex-1 text-black text-xs h-9">
                        <Input name="birthday" type="date" placeholder="請選擇生日" class="w-full rounded"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-white">
                        <span>門禁卡號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="access_card" placeholder="請輸入門禁卡號" class="w-full rounded"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full text-sm gap-0.5">
                <div class="flex gap-0.5 shrink-0 text-white">
                    <span>備註：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="remark" placeholder="請輸入備註" class="w-full rounded h-full min-h-[80px] max-h-[160px]"/>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full text-sm gap-0.5">
                <div class="flex gap-0.5 shrink-0 text-white">
                    <span>身分別：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <CheckBoxes name="boarder_role_ids" :items="boarderRoleList" v-slot="{ item, checked }" item-key="id" class="flex flex-wrap gap-2">
                        <button type="button" class="text-xs px-2 py-1 border rounded" :class="checked ? 'text-white bg-gray-400' : 'bg-white'">
                            {{ item?.name }}
                        </button>
                    </CheckBoxes>
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
    import { BoarderRolesCaller, BoarderStatusesCaller, ClassesCaller } from '~/composables/api/share';
    import { BoarderCaller, updateBoarder } from '~/composables/api/boarder';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onSaved'): void;
    }

    const schema = yup.object().shape({
        name: yup.string().required(),
        sid: yup.string().nullable(),
        class_id: yup.number().nullable(),
        boarder_status_id: yup.number().required(),
        phone: yup.string().nullable(),
        birthday: yup.string().nullable(),
        access_card: yup.string().nullable(),
        remark: yup.string().nullable(),
        boarder_role_ids: yup.array(yup.number()).nullable(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { handleSubmit, setFieldValue } = useForm({ validationSchema: schema });

    const popUp = ref();
    const visible = ref(false);

    const boarderCaller = new BoarderCaller();
    const classesCaller = new ClassesCaller();
    const { data: classList } = classesCaller;
    const boarderStatusesCaller = new BoarderStatusesCaller()
    .success((v) => setFieldValue('boarder_status_id', v?.data?.[0]?.id));
    const { data: boarderStatusList } = boarderStatusesCaller;
    const boarderRolesCaller = new BoarderRolesCaller();
    const { data: boarderRoleList } = boarderRolesCaller;

    const onSubmit = handleSubmit(async (data) => {
        const boader = boarderCaller?.data?.value;

        await updateBoarder({
            id: boader?.id!,
            name: data?.name,
            sid: data?.sid,
            class_id: data?.class_id,
            boarder_status_id: data?.boarder_status_id,
            phone: data?.phone,
            birthday: data?.birthday,
            access_card: data?.access_card,
            remark: data?.remark,
            boarder_role_ids: data?.boarder_role_ids,
        });

        toastNotifier?.success('儲存成功');
        emits('onSaved');
        close();
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const show = async (boarderId: string) => {
        boarderCaller.id = boarderId;
        boarderCaller?.reload();

        Promise.all([
            boarderCaller?.wait(),
            classesCaller?.wait(),
            boarderStatusesCaller?.wait(),
            boarderRolesCaller?.wait(),
        ])
        .then(() => {
            const boader = boarderCaller?.data?.value;

            setFieldValue('name', boader?.name);
            setFieldValue('sid', boader?.sid);
            setFieldValue('class_id', boader?.class?.id);
            setFieldValue('boarder_status_id', boader?.boarder_status?.id);
            setFieldValue('phone', boader?.phone);
            setFieldValue('birthday', new Date(boader?.birthday ?? '').toISOString().split('T')[0]);
            setFieldValue('access_card', boader?.access_card);
            setFieldValue('remark', boader?.remark);
            setFieldValue('boarder_role_ids', boader?.boarder_roles?.map((v) => v?.id))

            popUp.value?.show();
            visible.value = true;
        });
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>