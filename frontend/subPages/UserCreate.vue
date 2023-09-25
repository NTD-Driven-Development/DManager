<template>
    <div class="flex flex-col overflow-hidden rounded text-sm bg-white">
        <form class="flex flex-1 flex-col p-3 gap-2 border border-gray-300 lg:p-5">
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
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>學號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="sid" placeholder="請輸入學號" class="w-full rounded border"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span class="text-red-500">*</span>
                    <span>電子郵件：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <Input name="email" placeholder="請輸入電子郵件" type="email" class="w-full rounded border"/>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span>備註：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="remark" placeholder="請輸入備註" class="w-full rounded h-full min-h-[80px] max-h-[160px] border"/>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full text-sm gap-0.5">
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
        <button class="flex items-center justify-center p-2 bg-gray-600 text-white" @click="onSubmit">
            新增成員
        </button>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { createUser } from '~/composables/api/user';
    import * as yup from 'yup';
    import _ from 'lodash';
import { RolesCaller } from '~/composables/api/share';

    interface Emits {
        (e: 'onCreated'): void,
    }

    const schema = yup.object().shape({
        email: yup.string().email().required(),
        name: yup.string().required(),
        sid: yup.string().required(),
        remark: yup.string().nullable(),
        role_ids: yup.array(yup.number()).nullable(),
    });

    const emits = defineEmits<Emits>();

    const { handleSubmit, values, setFieldValue } = useForm({ validationSchema: schema });
    const toastNotifier = inject(ToastNotifierKey);

    const rolesCaller = new RolesCaller();
    const { data: roleList } = rolesCaller;

    const onSubmit = handleSubmit(async (data) => {
        try {            
            await createUser({
                name: data?.name,
                sid: data?.sid,
                email: data?.email,
                remark: data?.remark,
                role_ids: data?.role_ids,
            });

            toastNotifier?.success('新增成功');
            emits('onCreated');
            setFieldValue('name', undefined);
            setFieldValue('sid', undefined);
            setFieldValue('email', undefined);
            setFieldValue('remark', undefined);
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });
</script>