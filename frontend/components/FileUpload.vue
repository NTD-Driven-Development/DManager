<template>
    <div>
        <slot :value="inputValue" :remove="remove"/>
        <input class="hidden" :id="name" type="file" :accept="accept" @change="load"/>
    </div>
</template>

<script setup lang="ts">
    import { useField } from 'vee-validate';
    import _ from 'lodash';

    const props = defineProps({
        initValue: {
            type: Object,
        },
        accept: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
    });

    const name = toRef(props, 'name');

    const {
        value: inputValue,
        handleChange,
        resetField,
    } = useField(name, undefined, { initialValue: props.initValue });

    const remove = () => resetField();

    const load = (event: any) => {
        const input = event.target;

        if(!input.files[0]) return;

        const vaildFiles = Array.from(input.files).filter((it: any) => mimeTypeVaildator(it?.type, input?.accept));
        vaildFiles.slice(0, 1).forEach((element: any) => {
            const reader = new FileReader();
            
            if (element.type.includes('image')) {
                reader.onloadend = async (event) => {
                    const content = await resize(event?.target?.result as string, 1920);

                    handleChange({ content: content, type: 'image/jpeg', name: element.name, size: element.size });
                };
                reader.readAsDataURL(element);
            }
            else {
                reader.onloadend = (event) => {
                    handleChange({ content: _.clone(event?.target?.result as string), type: element.type, name: element.name, size: element.size });
                };
                reader.readAsDataURL(element);
            }
        });
    };

    const mimeTypeVaildator = (checkType: string, accpetString?: string) => {
        if (!accpetString) return true;

        return accpetString.replace(/\s/g, '').split(',').filter(accept => {
            return new RegExp(accept.replace('*', '.*')).test(checkType);
        }).length > 0;
    }
</script>