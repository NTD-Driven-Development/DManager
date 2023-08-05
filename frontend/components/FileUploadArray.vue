<template>
    <VueDraggable v-model="fields" :disabled="disabled" :handle="handle" draggable=".draggable-item" @end="change">
        <div v-for="field, index in fields" :key="field.key" class="draggable-item" :class="itemsContainerClass">
            <slot :field="field" :index="index" :remove="remove"/>
        </div>
        <div :class="addContainerClass">
            <slot name="add" :fields="fields"></slot>
        </div>
        <Field v-for="field, index in fields" :key="index" :name="`${name}[${index}]`" :id="`${name}.${index}`" type="file" :disabled="disabled" :accept="accept" class="hidden" @change="replaceField($event, field)"/>
        <input class="hidden" :id="`${name}.add`" type="file" :disabled="disabled" :accept="accept" multiple @change="load"/>
    </VueDraggable>
</template>

<script setup lang="ts">
    import { Field, useFieldArray, FieldEntry, useField } from 'vee-validate';
    import { VueDraggable } from 'vue-draggable-plus';
    import _ from 'lodash';

    interface File {
        content: string,
        type: string,
        name: string,
    }

    interface Props {
        limit?: number,
        accept?: string,
        name: string,
        disabled?: boolean,
        handle?: string,
        itemsContainerClass?: string,
        addContainerClass?: string,
    }

    const props = withDefaults(defineProps<Props>(), {
        limit: 10,
        disabled: false,
        handle: undefined,
    });

    const name = toRef(props, 'name');

    const {
        fields,
        push,
        remove,
        move,
    } = useFieldArray<File>(name);

    const { } = useField(name); // 避免test在載入時觸發

    const change = (event: any) => {
        move(event.oldIndex, event.newIndex);
    };
    
    const replaceField = (event: Event, field: FieldEntry<File>) => {
        const input = event.target as HTMLInputElement;

        if(!input.files?.length) return;

        const vaildFiles = Array.from(input.files).filter((it) => mimeTypeVaildator(it?.type, input?.accept));
        vaildFiles.slice(0, 1).forEach(element => {
            const reader = new FileReader();

            if (element.type.includes('image')) {
                reader.onloadend = async (event) => {
                    const content = await resize(event?.target?.result as string, 1920);

                    if (content == 'data:') return;

                    field.value = { content: content, type: 'image/jpeg', name: element.name };
                };
                reader.readAsDataURL(element);
            }
            else {
                reader.onloadend = (event) => {
                    field.value = { content: _.clone(event?.target?.result as string), type: element.type, name: element.name };
                };
                reader.readAsDataURL(element);
            }
        });
    };

    const load = (event: Event) => {
        const input = event.target as HTMLInputElement;

        if(!input.files?.length) return;

        const vaildFiles = Array.from(input.files).filter((it) => mimeTypeVaildator(it?.type, input?.accept));
        vaildFiles.slice(0, props.limit - fields.value.length).forEach(element => {
            const reader = new FileReader();

            if (element.type.includes('image')) {
                reader.onloadend = async (event) => {
                    const content = await resize(event?.target?.result as string, 1920);

                    if (content == 'data:') return;

                    push({ content: content, type: 'image/jpeg', name: element.name });
                };
                reader.readAsDataURL(element);
            }
            else {
                reader.onloadend = (event) => {
                    push({ content: _.clone(event?.target?.result as string), type: element.type, name: element.name });
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