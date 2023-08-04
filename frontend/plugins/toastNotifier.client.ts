import { createApp } from 'vue';
import Toast from '~/components/ToastNotifier.vue';

export default defineNuxtPlugin((nuxtApp): any => {
    const mountPoint = document.createElement('div');
    document.body.appendChild(mountPoint);
    const toast = createApp(Toast).mount(mountPoint) as InstanceType<typeof Toast>;
    nuxtApp.vueApp.provide('toastNotifier', toast);
})