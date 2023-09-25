<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-6/12 max-w-[80%] max-h-[80%] text-sm bg-white rounded">
        <form class="flex w-full flex-col p-3 gap-2 overflow-auto lg:p-5">
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>姓名：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="name" placeholder="請輸入姓名" class="w-full rounded border"/>
                    </div>
                </div>
                <div class="flex flex-col justify-center w-full gap-0.5" v-if="!user?.is_admin">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>學號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="sid" placeholder="請輸入學號" class="w-full rounded border"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5" v-if="!user?.is_admin">
                <div class="flex gap-0.5 shrink-0">
                    <span>備註：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="remark" placeholder="請輸入備註" class="w-full rounded h-full min-h-[80px] max-h-[160px] border"/>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full text-sm gap-0.5" v-if="!user?.is_admin">
                <div class="flex gap-0.5 shrink-0">
                    <span>角色：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <CheckBoxes name="role_ids" :items="roleList" v-slot="{ item, checked }" item-key="id" class="flex flex-wrap gap-2">
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
    import { RolesCaller } from '~/composables/api/share';
    import { UserCaller, updateUser } from '~/composables/api/user';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onEdited'): void;
    }

    const schema = yup.object().shape({
        name: yup.string().required(),
        sid: yup.string().test((v) => user.value?.is_admin || !_.isEmpty(v))?.nullable(),
        remark: yup.string().nullable(),
        role_ids: yup.array(yup.number()).nullable(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { handleSubmit, setFieldValue } = useForm({ validationSchema: schema });

    const rolesCaller = new RolesCaller();
    const { data: roleList } = rolesCaller;

    const popUp = ref();
    const visible = ref(false);

    const userCaller = new UserCaller();
    const { data: user } = userCaller;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const user = userCaller?.data?.value;

            await updateUser({
                id: user?.id!,
                name: data?.name,
                sid: data?.sid,
                remark: data?.remark,
                role_ids: data?.role_ids,
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

    const show = async (userId: number) => {
        userCaller.id = userId;
        userCaller?.reload();

        await userCaller?.wait();

        const user = userCaller?.data?.value;

        setFieldValue('name', user?.name);
        setFieldValue('sid', user?.sid);
        setFieldValue('remark', user?.remark);
        setFieldValue('role_ids', user?.roles?.map((v) => v?.id));

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>