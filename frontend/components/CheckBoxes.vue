<template>
    <div>
        <div v-for="it in items" @click="() => toggle(it)">
            <slot :item="it"
            :checked="isChecked(it)"></slot>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T, K extends keyof T | undefined = undefined">
    import { useFieldArray } from 'vee-validate';
    import _ from 'lodash';

    type TypedValue = undefined extends K ? T : K extends keyof T ? T[K] : never;

    interface Props {
        initValue?: T[],
        items?: T[],
        itemKey?: K,
        name: string,
        disabled?: boolean,
    }

    const props = withDefaults(defineProps<Props>(), {
        disabled: false,
    });

    const name = toRef(props, 'name');

    const {
        fields,
        push,
        remove,
    } = useFieldArray<TypedValue>(name);

    const toTypedValue = (it: T): TypedValue => {
        if (props?.itemKey) {
            return it[props.itemKey] as TypedValue;
        }
        else {
            return it as TypedValue;
        }
    }

    const isChecked = (it: T) => {
        const value = toTypedValue(it);

        const existIndex = _.findIndex(fields.value, (v) => {
            return _.isEqual(v.value, value);
        });

        return existIndex != -1;
    }

    const toggle = (it: T) => {
        const value = toTypedValue(it);

        const existIndex = _.findIndex(fields.value, (v) => {
            return _.isEqual(v.value, value);
        });
        const target = _.find(props.items, (v) => {
            return _.isEqual(v, it);
        });

        if (existIndex != -1) {
            remove(existIndex);
        }
        else if (target) {
            push(value);
        }
    }
</script>