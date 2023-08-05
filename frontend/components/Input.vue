<template>
    <input :name="name" :id="name" :type="type" :value="inputValue" :placeholder="placeholder" :autocomplete="autocomplete" @input="handleChange" @blur="handleBlur">
</template>

<script setup lang="ts">
    import { useField } from 'vee-validate';

    interface Props {
        inputClass?: string,
        type?: string,
        autocomplete?: string,
        initValue?: string,
        name: string,
        placeholder?: string,
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
    } = useField(name, undefined, { initialValue: props.initValue });
</script>