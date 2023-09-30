<template>
    <div class="col-span-full flex flex-col gap-2 p-4 rounded-lg shadow bg-white">
        <div class="text-xl pb-2">個人資訊</div>
        <div class="flex flex-col text-xs sm:text-sm">
            <div class="flex items-center py-3 gap-1 border-t">
                <span class="shrink-0">姓名：</span>
                <span class="break-all" v-show="!isEditable">{{ checkValueEmpty(authUser?.name) }}</span>
                <Input v-show="isEditable" name="name" placeholder="請輸入姓名" class="flex-1 px-3 py-1.5 border rounded"/>
            </div>
            <div class="flex items-center py-3 gap-1 border-t">
                <span class="shrink-0">電子郵件：</span>
                <span class="break-all">{{ checkValueEmpty(authUser?.email) }}</span>
            </div>
            <div class="flex items-center py-3 gap-1 border-t">
                <span class="shrink-0">學號：</span>
                <span class="break-all" v-show="!isEditable || authUser?.is_admin">{{ checkValueEmpty(authUser?.sid) }}</span>
                <Input v-show="isEditable && !authUser?.is_admin" name="sid" placeholder="請輸入學號" class="flex-1 px-3 py-1.5 border rounded"/>
            </div>
            <div class="flex items-center py-3 gap-1 border-t">
                <span class="shrink-0">備註：</span>
                <span class="break-all" v-show="!isEditable">{{ checkValueEmpty(authUser?.remark) }}</span>
                <TextArea v-show="isEditable" name="remark" placeholder="請輸入備註" class="flex-1 px-3 py-1.5 border rounded"/>
            </div>
            <div class="flex items-center py-3 gap-1 border-t">
                <span class="shrink-0">身分：</span>
                <span class="break-all">{{ checkValueEmpty(authUser?.roles, (v) => v?.map((v) => v.name).join('、')) }}</span>
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <button class="px-3 py-1.5 rounded text-sm text-white bg-gray-600" v-show="!isEditable" @click="onEdit">修改</button>
            <button class="px-3 py-1.5 rounded text-sm text-white bg-lime-600" v-show="isEditable" @click="onSave">保存</button>
            <button class="px-3 py-1.5 rounded text-sm text-white bg-red-600" v-show="isEditable" @click="onCancel">放棄</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { useAuthStore } from '~/stores/auth';
    import { updateUser } from '~/composables/api/user';
    import * as yup from 'yup';
    import _ from 'lodash';

    const schema = yup.object().shape({
        name: yup.string().required(),
        sid: yup.string().test((v) => authUser.value?.is_admin || !_.isEmpty(v))?.nullable(),
        remark: yup.string().nullable(),
        role_ids: yup.array(yup.number()).nullable(),
    });

    const { handleSubmit, setFieldValue, resetForm } = useForm({ validationSchema: schema });
    const toastNotifier = inject(ToastNotifierKey);

    const authStore = useAuthStore();
    const { authUser } = storeToRefs(authStore);
    const { session, refresh } = authStore;

    const isEditable = ref(false);

    const onEdit = () => {
        const { value: user } = authUser;

        setFieldValue('name', user?.name);
        setFieldValue('sid', user?.sid);
        setFieldValue('remark', user?.remark);
        setFieldValue('role_ids', user?.roles?.map((v) => v?.id));

        isEditable.value = true;
    }
    const onSave = handleSubmit(async (data) => {
        try {
            const { value: user } = authUser; 
            await updateUser({
                id: user?.id!,
                name: data?.name,
                sid: data?.sid,
                remark: data?.remark,
                role_ids: data?.role_ids,
            });
            await refresh();
            await session();
            isEditable.value = false;
            toastNotifier?.success('保存成功');
        }
        catch (error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });
    const onCancel = () => {
        resetForm();
        isEditable.value = false;
    }
</script>