<template>
    <div>
        <input :name="name" :id="name" :type="type" :value="inputValue" :placeholder="placeholder"
        autocomplete="off" class="peer" :class="inputClass"
        @input="handleChange" @blur="handleBlur">
        <div class="fixed bg-white w-52 max-h-[320px] mt-2 overflow-auto rounded z-20 hidden peer-focus:block">
            <div v-for="it in options?.filter((v) => v?.includes(inputValue))" class="p-2 border hover:bg-gray-100 cursor-pointer"
            @mousedown.prevent="setValue(it)">{{ it }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useField } from 'vee-validate';

    interface Props {
        inputClass?: string,
        type?: string,
        initValue?: string,
        name: string,
        placeholder?: string,
        options: string[],
    }

    const props = withDefaults(defineProps<Props>(), {
        inputClass: '',
        type: 'text',
        autocomplete: '',
        initValue: '',
        placeholder: '',
    });

    const name = toRef(props, 'name');

    const {
        value: inputValue,
        handleBlur,
        handleChange,
        setValue,
    } = useField(name, undefined, { initialValue: props.initValue });
</script>