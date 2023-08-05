<template>
    <button @click="!disabled && setValue(!value)" type="button">
        <slot></slot>
        <input type="checkbox" class="hidden" :id="name" :name="name" :checked="initValue"/>
    </button>
</template>

<script setup lang="ts">
    import { useField } from 'vee-validate';

    interface Props {
        initValue?: boolean,
        name: string,
        disabled?: boolean,
    }

    const props = withDefaults(defineProps<Props>(), {
        initValue: false,
        disabled: false,
    });

    const name = toRef(props, 'name');

    const {
        value,
        setValue,
    } = useField(name, undefined, { initialValue: props.initValue });
</script>