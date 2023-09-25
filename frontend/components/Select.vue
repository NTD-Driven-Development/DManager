<template>
    <select :name="name" :id="name" :value="inputValue" :placeholder="placeholder" :disabled="disabled" @input="handleChange" @blur="handleBlur">
        <option v-for="it, index in options" :key="index" :value="optionKey ? it[optionKey as unknown as K] : it">
            {{ content(it) }}
        </option>
    </select>
</template>

<script setup lang="ts" generic="T, K extends keyof T">
    import { useField } from 'vee-validate';
    import _ from 'lodash';

    interface Props {
        initValue?: T[K],
        optionKey?: K,
        optionValue?: ((it: T) => string) | K;
        options?: readonly T[],
        name: string,
        placeholder?: string,
        disabled?: boolean,
    }

    const props = withDefaults(defineProps<Props>(), {
        options: () => [] as T[],
        placeholder: '',
    })

    const name = toRef(props, 'name');

    const {
        value: inputValue,
        handleBlur,
        handleChange,
    } = useField(name, undefined, { initialValue: props.initValue });

    const content = (value: T) => {
        const { optionValue } = props;

        if (_.isFunction(optionValue))
            return optionValue(value);
        else if (_.isString(optionValue))
            return value[optionValue];
        else
            return value;
    }
</script>