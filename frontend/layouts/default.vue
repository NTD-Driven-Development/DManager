<template>
    <div class="fixed w-full h-full">
        <!-- 側邊欄展開時黑幕 -->
        <div ref="sideBarBlackScreen" class="absolute z-40 duration-700 transition-colors" @click.stop="isMenuOpen = false"/>
        <!-- SideBar -->
        <div class="absolute flex flex-col h-full top-0 z-40 overflow-hidden duration-500 bg-contain" 
        :class="[sideBarWidth, isMenuOpen ? `max-w-full` : `max-w-0 md:max-w-none`]">
            <!-- SideBarHeader -->
            <div class="flex items-center justify-between text-white h-12 px-3 shrink-0 relative"
            :class="[sideBarHeaderColor, sideBarWidth]">
                <div class="w-6 flex items-center justify-center">
                    <img src="/favicon.ico">
                </div>
                <div class="overflow-hidden whitespace-nowrap">後台管理系統</div>
                <button class="aspect-square hover:rotate-90 duration-200" @click="isMenuOpen = false">
                    <Icon icon="ic:round-close" class="w-6 h-6 text-white md:invisible"/>
                </button>
            </div>
            <!-- SideBarContent -->
            <div class="overflow-auto h-full" :class="[sideBarContentColor, sideBarWidth]">
                <div class="flex p-4 bg-gray-600">
                    <NuxtLink to="/profile">
                        <img :src="avatar(authUser?.name)" class="aspect-square h-full rounded-full object-cover bg-white overflow-hidden">
                    </NuxtLink>
                    <div class="text-white flex flex-1 flex-col overflow-hidden px-4 py-2">
                        <div>{{ authUser?.name }}</div>
                        <div class="text-xs mt-1 truncate">{{ authUser?.roles?.map((v) => v?.name)?.join('、') }}</div>
                    </div>
                </div>
                <button class="flex items-center justify-between w-full py-3.5 px-4 bg-white"
                @click="navigateTo('/projects'); isMenuOpen = false;">
                    <div :class="[{ 'font-bold': $route.path.startsWith('/projects') }]">項目管理</div>
                    <Icon icon="ic:baseline-circle" class="text-gray-600 text-sm"
                    v-show="$route.path.startsWith('/projects')"></Icon>
                </button>
                <button class="flex items-center justify-between w-full py-3.5 px-4 bg-white"
                @click="navigateTo('/boarders'); isMenuOpen = false;">
                    <div :class="[{ 'font-bold': $route.path.startsWith('/boarders') }]">住宿生管理</div>
                    <Icon icon="ic:baseline-circle" class="text-gray-600 text-sm"
                    v-show="$route.path.startsWith('/boarders')"></Icon>
                </button>
                <button class="flex items-center justify-between w-full py-3.5 px-4 bg-white"
                @click="navigateTo('/records'); isMenuOpen = false;">
                    <div :class="[{ 'font-bold': $route.path.startsWith('/records') }]">紀錄管理</div>
                    <Icon icon="ic:baseline-circle" class="text-gray-600 text-sm"
                    v-show="$route.path.startsWith('/records')"></Icon>
                </button>
                <button class="flex items-center justify-between w-full py-3.5 px-4 bg-white" 
                @click="navigateTo('/notes'); isMenuOpen = false;">
                    <div :class="[{ 'font-bold': $route.path.startsWith('/notes') }]">記事管理</div>
                    <Icon icon="ic:baseline-circle" class="text-gray-600 text-sm"
                    v-show="$route.path.startsWith('/notes')"></Icon>
                </button>
                <button class="flex items-center justify-between w-full py-3.5 px-4 bg-white" 
                @click="navigateTo('/users'); isMenuOpen = false;" v-if="authUser?.is_admin">
                    <div :class="[{ 'font-bold': $route.path.startsWith('/users') }]">成員管理</div>
                    <Icon icon="ic:baseline-circle" class="text-gray-600 text-sm"
                    v-show="$route.path.startsWith('/users')"></Icon>
                </button>
                <button class="flex items-center justify-between w-full py-3.5 px-4 bg-white" 
                @click="navigateTo('/exports'); isMenuOpen = false;">
                    <div :class="[{ 'font-bold': $route.path.startsWith('/exports') }]">匯出管理</div>
                    <Icon icon="ic:baseline-circle" class="text-gray-600 text-sm"
                    v-show="$route.path.startsWith('/exports')"></Icon>
                </button>
                <button class="flex items-center justify-between w-full py-3.5 px-4 bg-white" 
                @click="navigateTo('/options'); isMenuOpen = false;">
                    <div :class="[{ 'font-bold': $route.path.startsWith('/options') }]">選單管理</div>
                    <Icon icon="ic:baseline-circle" class="text-gray-600 text-sm"
                    v-show="$route.path.startsWith('/options')"></Icon>
                </button>
                <button class="flex items-center justify-between w-full py-3.5 px-4 bg-white" 
                @click="navigateTo('/logs'); isMenuOpen = false;">
                    <div :class="[{ 'font-bold': $route.path.startsWith('/logs') }]">事件記錄</div>
                    <Icon icon="ic:baseline-circle" class="text-gray-600 text-sm"
                    v-show="$route.path.startsWith('/logs')"></Icon>
                </button>
                <button class="flex items-center justify-between w-full py-3.5 px-4 bg-white" 
                @click="logout(); isMenuOpen = false;">
                    <div>登出</div>
                </button>
            </div>
        </div>
        <!-- Page -->
        <div class=" h-full">
            <!-- PageHeader -->
            <div class="flex justify-between h-12" :class="[pageHeaderColor]">
                <button class="flex items-center justify-center aspect-square">
                    <Icon icon="ic:round-menu" class="w-7 h-7 text-white" @click="isMenuOpen = true"></Icon>
                </button>
                <div class="flex items-center justify-center text-white text-sm">
                    <NuxtLink to="/summary" target="_blank" class="flex items-center justify-center h-full px-3">人數概況表</NuxtLink>
                </div>
            </div>
            <!-- PageContent -->
            <main id="main" class="h-[calc(100%-48px)] md:ml-60 overflow-auto" :class="[pageContentColor]">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '~/stores/auth';
    import { Icon } from '@iconify/vue';

    // layout config
    const sideBarHeaderColor = 'bg-gray-700';
    const sideBarContentColor = 'bg-gray-200';
    const pageHeaderColor = 'bg-gray-700';
    const pageContentColor = 'bg-white';
    const sideBarWidth = `w-[240px]`;

    const authStore = useAuthStore();
    const { authUser } = storeToRefs(authStore);
    const toastNotifier = inject(ToastNotifierKey);
    const isMenuOpen = ref(false);

    const sideBarBlackScreen = ref<HTMLElement>();

    const logout = () => {
        authStore.logout()
        .then(() => {
            navigateTo('/login', { replace: true });
            toastNotifier?.success('登出成功');
        })
        .catch((error) => toastNotifier?.error(error))
    }

    // layout event
    watch(() => isMenuOpen.value, (n) => {
        if (n) {
            sideBarBlackScreen.value?.classList?.add('w-full', 'h-full', 'bg-black/30', 'md:w-0', 'md:h-0');
        }
        else {
            sideBarBlackScreen.value?.classList?.add('pointer-events-none');
            sideBarBlackScreen.value?.classList?.remove('bg-black/30');
            setTimeout(() => {
                sideBarBlackScreen.value?.classList?.remove('pointer-events-none');
                if (isMenuOpen.value) return;
                sideBarBlackScreen.value?.classList?.remove('w-full', 'h-full', 'md:w-0', 'md:h-0');
            }, 1000);
        }
    });
</script>