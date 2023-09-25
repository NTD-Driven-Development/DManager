<template>
    <textarea :name="name" :id="name" :value="inputValue" :placeholder="placeholder" @input="handleChange" @blur="handleBlur"/>
</template>

<script setup lang="ts">
    import { useField } from 'vee-validate';

    interface Props {
        inputClass?: string,
        initValue?: string,
        name: string,
        placeholder?: string,
    }

    const props = withDefaults(defineProps<Props>(), {
        inputClass: '',
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