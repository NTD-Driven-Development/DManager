<template>
    <div tabindex="0" :class="visible ? 'fixed top-0 left-0 w-full h-full bg-black/30 z-40 cursor-default': 'hidden'"
    @mouseup.stop="onEdgeClick()">
        <div class="fixed translate-x-1/2 translate-y-1/2 bottom-1/2 right-1/2 z-50 min-w-[320px]"
        :class="props.containerClass" @mouseup.stop @click.stop @mousedown.stop>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface Props {
        closeWhenEdgeClick?: boolean,
        onAfterShow?: Function,
        onBeforeClose?: Function,
        containerClass?: string,
    }

    const props = withDefaults(defineProps<Props>(), {
        closeWhenEdgeClick: true,
        containerClass: '',
    });

    const onEdgeClick = () => {
        props.closeWhenEdgeClick && close();
    };

    const visible = ref(false);

    const show = () => {
        visible.value = true;
        props.onAfterShow && props.onAfterShow(); //raise if onAfterShow callback existed.
    };
    const close = () => {
        props.onBeforeClose && props.onBeforeClose(); //raise if onBeforeClose callback existed.
        visible.value = false;
    };

    defineExpose({ show, close });
</script>