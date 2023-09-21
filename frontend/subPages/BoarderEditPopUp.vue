<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-6/12 max-w-[80%] max-h-[80%] text-sm bg-white rounded">
        <form class="flex w-full flex-col p-3 gap-2 overflow-auto lg:p-5">
            <div class="flex justify-center w-full gap-2">
                <div class="flex items-center justify-center w-full py-8">
                    <FileUpload name="avatar" accept="image">
                        <label for="avatar">
                            <img :src="values?.avatar?.content ?? avatar(values?.name)" class="rounded-full h-32 aspect-square object-cover">
                        </label>
                    </FileUpload>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>姓名：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="name" placeholder="請輸入姓名" class="w-full rounded border"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span>學號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="sid" placeholder="請輸入學號" class="w-full rounded border"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>班級：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <InputSelect name="class" placeholder="請選擇班級"
                        :options="['暫無', ...classList?.map((v) => v?.name) ?? []]"
                        input-class="w-full rounded border"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>住宿狀態：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="boarder_status_id" placeholder="請選擇住宿狀態"
                        :options="boarderStatusList" :option-key="'id'" :option-value="'name'"
                        class="w-full rounded border"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span>電話：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="phone" placeholder="請輸入電話" class="w-full rounded border"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span>生日：</span>
                    </div>
                    <div class="flex-1 text-black text-xs h-9">
                        <Input name="birthday" type="date" placeholder="請選擇生日" class="w-full rounded border"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col text-sm gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span>門禁卡號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="access_card" placeholder="請輸入門禁卡號" class="w-full rounded border"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full text-sm gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span>備註：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="remark" placeholder="請輸入備註" class="w-full rounded h-full min-h-[80px] max-h-[160px] border"/>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full text-sm gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span>身分別：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <CheckBoxes name="boarder_role_ids" :items="boarderRoleList" v-slot="{ item, checked }" item-key="id" class="flex flex-wrap gap-2">
                        <button type="button" class="text-xs px-2 py-1 border rounded" :class="checked ? 'text-white bg-gray-500' : 'bg-white'">
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
    import { format } from 'date-fns';
    import { BoarderRolesCaller, BoarderStatusesCaller, ClassesCaller } from '~/composables/api/share';
    import { BoarderCaller, updateBoarder } from '~/composables/api/boarder';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onEdited'): void;
    }

    const schema = yup.object().shape({
        avatar: yup.object().shape({
            content: yup.string().required(),
        }).nullable().default(undefined),
        name: yup.string().required(),
        sid: yup.string().nullable(),
        class: yup.string().test((v) => !!classList?.value?.find((it) => it?.name)).required(),
        boarder_status_id: yup.number().required(),
        phone: yup.string().nullable(),
        birthday: yup.string().nullable(),
        access_card: yup.string().nullable(),
        remark: yup.string().nullable(),
        boarder_role_ids: yup.array(yup.number()).nullable(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { values, handleSubmit, setFieldValue } = useForm({ validationSchema: schema });

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
        try {
            const boader = boarderCaller?.data?.value;
            const classId = classList?.value?.find((it) => it?.name == data?.class)?.id ?? 0;

            await updateBoarder({
                id: boader?.id!,
                avatar: data?.avatar?.content,
                name: data?.name,
                sid: data?.sid,
                class_id: classId != 0 ? classId : null,
                boarder_status_id: data?.boarder_status_id,
                phone: data?.phone,
                birthday: data?.birthday,
                access_card: data?.access_card,
                remark: data?.remark,
                boarder_role_ids: data?.boarder_role_ids,
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

    const show = async (projectId: number, boarderId: string) => {
        boarderCaller.id = boarderId;
        boarderCaller?.reload();
        boarderRolesCaller?.withQuery('project_id', projectId)

        Promise.all([
            boarderCaller?.wait(),
            classesCaller?.wait(),
            boarderStatusesCaller?.wait(),
            boarderRolesCaller?.wait(),
        ])
        .then(() => {
            const boader = boarderCaller?.data?.value;

            setFieldValue('avatar', boader?.avatar ? {
                content: boader?.avatar,
            } : undefined);
            setFieldValue('name', boader?.name);
            setFieldValue('sid', boader?.sid);
            setFieldValue('class', boader?.class?.name ?? '暫無');
            setFieldValue('boarder_status_id', boader?.boarder_status?.id);
            setFieldValue('phone', boader?.phone);
            setFieldValue('birthday', boader?.birthday ? format(new Date(boader?.birthday), 'yyyy-MM-dd') : undefined);
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