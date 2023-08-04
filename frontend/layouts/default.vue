<template>
    <div class="absolute w-full h-full font-GenJyuuGothic">
        <div class="absolute bg-black/30 z-40" :class="{'w-full h-full md:w-0 md:h-0': isMenuOpen}"
        @click.stop="isMenuOpen = false"/>
        <div class="absolute flex flex-col h-full top-0 z-40 overflow-hidden transition-all ease-in-out duration-700 bg-gray-200 bg-contain" 
        :class="isMenuOpen?'w-60' : 'w-0 md:w-60'">
            <div class="flex items-center justify-between text-white h-12 px-3 shrink-0 relative transition-all ease-in-out duration-500 bg-gray-700">
                <!-- LOGO -->
                <!-- <NuxtLink to="/dashboard">
                    <img src="~/assets/images/logo.png" alt="logo" class="absolute -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2 h-3/4" />
                </NuxtLink> -->
                <div class="text-lg overflow-hidden whitespace-nowrap">後台管理系統</div>
                <!-- 關閉 -->
                <!-- <FAIcon :icon="['fas', 'xmark']" class="text-xl text-white cursor-pointer md:invisible"
                @click="isMenuOpen = false"/> -->
                <Icon icon="mdi:close" class="text-2xl text-white cursor-pointer md:invisible" @click="isMenuOpen = false"/>
            </div>
            <!-- <div class="flex h-24 min-w-[240px] p-4 transition-all ease-in-out duration-500 bg-primary-blue">
                <NuxtLink to="/profile">
                    <img :src="authUser?.profile_photo_path" class="aspect-square h-full rounded-full object-cover bg-white overflow-hidden"/>
                </NuxtLink>
                <div class="text-white flex flex-1 flex-col overflow-hidden px-4 py-2">
                    <div>{{ authUser?.name }}</div>
                    <div class="text-sm truncate">{{ authUser?.roles?.map((it) => it.name).join(', ') }}</div>
                </div>
            </div> -->
            <div class="overflow-auto">
                <div class="relative flex flex-col w-full min-w-[240px] bg-white leading-12 sm:w-fit">
                    <NuxtLink to="/" class="flex cursor-pointer py-3.5 px-4 w-full" @click="isMenuOpen = false">我的主頁</NuxtLink>
                </div>
                <!-- <div class="relative flex flex-col w-full min-w-[240px] bg-white leading-12 sm:w-fit">
                    <input id="engine" ref="engine" type="checkbox" class="hidden peer">
                    <label for="engine" class="flex cursor-pointer py-3.5 px-4 w-full">機房管理</label>
                    <div class="hidden peer-checked:flex flex-col text-sm">
                        <NuxtLink to="/engine/all" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">所有機房</NuxtLink>
                        <NuxtLink to="/engine/mine" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">我的機房</NuxtLink>
                        <NuxtLink to="/engine/create" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">新增機房</NuxtLink>
                    </div>
                </div>
                <div class="relative flex flex-col w-full min-w-[240px] bg-white leading-12 sm:w-fit">
                    <input id="worker" ref="worker" type="checkbox" class="hidden peer">
                    <label for="worker" class="flex cursor-pointer py-3.5 px-4 w-full">菜品管理</label>
                    <div class="hidden peer-checked:flex flex-col text-sm">
                        <NuxtLink to="/worker/all" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">所有菜品</NuxtLink>
                        <NuxtLink to="/worker/mine" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">我的菜品</NuxtLink>
                        <NuxtLink to="/worker/create" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">新增菜品</NuxtLink>
                    </div>
                </div>
                <div class="relative flex flex-col w-full min-w-[240px] bg-white leading-12 sm:w-fit">
                    <input id="member" ref="member" type="checkbox" class="hidden peer">
                    <label for="member" class="flex cursor-pointer py-3.5 px-4 w-full">會員管理</label>
                    <div class="hidden peer-checked:flex flex-col text-sm">
                        <NuxtLink to="/member/mine" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">我的會員</NuxtLink>
                        <NuxtLink to="/member/create" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">新增會員</NuxtLink>
                        <NuxtLink to="/member/comments" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">評論列表</NuxtLink>
                    </div>
                </div>
                <div class="relative flex flex-col w-full min-w-[240px] bg-white leading-12 sm:w-fit">
                    <input id="staff" ref="staff" type="checkbox" class="hidden peer">
                    <label for="staff" class="flex cursor-pointer py-3.5 px-4 w-full">員工管理</label>
                    <div class="hidden peer-checked:flex flex-col text-sm">
                        <NuxtLink to="/staff/all" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">所有員工</NuxtLink>
                        <NuxtLink to="/staff/mine" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">我的員工</NuxtLink>
                        <NuxtLink to="/staff/create" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">新增員工</NuxtLink>
                    </div>
                </div>
                <div class="relative flex flex-col w-full min-w-[240px] bg-white leading-12 sm:w-fit">
                    <input id="security" ref="security" type="checkbox" class="hidden peer">
                    <label for="security" class="flex cursor-pointer py-3.5 px-4 w-full">安全設定</label>
                    <div class="hidden peer-checked:flex flex-col text-sm">
                        <NuxtLink to="/security/resetPassword" class="cursor-pointer py-2 px-8" @click="isMenuOpen = false">更改密碼</NuxtLink>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="flex justify-between bg-gray-700 h-12">
            <div class="relative flex justify-center items-center h-full aspect-square cursor-pointer transition-all ease-in-out tap-hignlight-disable" @click="isMenuOpen = true">
                <div class="w-5 h-[2.5px] bg-white transition-all ease-in-out md:hidden
                    before:absolute before:w-5 before:h-[2.5px] before:bg-white before:transition-all before:ease-in-out before:-translate-y-[7px]
                    after:absolute after:w-5 after:h-[2.5px] after:bg-white after:transition-all after:ease-in-out after:translate-y-[7px]"
                    :class="isMenuOpen?'bg-transparent -translate-x-4 before:rotate-45 after:-rotate-45 before:translate-x-3.5 before:-translate-y-0 after:translate-x-3.5 after:translate-y-0':''">
                </div>
            </div>
            <div class="flex items-center justify-center text-white text-sm">
                <button class="flex items-center justify-center h-full px-3" @click="logout()">登出</button>
                <NuxtLink to="/" class="flex items-center justify-center h-full px-3">我的網站</NuxtLink>
            </div>
        </div>
        <main class="h-[calc(100%-48px)] md:ml-60 overflow-auto transition-all ease-in-out duration-700 bg-white" id="main">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
    import { ToastNotifierKey } from '~/symbols/index';
    import { useAuthStore } from '~/stores/auth';
    import { Icon } from '@iconify/vue';

    const { path } = useRoute();
    const authStore = useAuthStore();
    const toastNotifier = inject(ToastNotifierKey);
    const isMenuOpen = ref(false);

    const markup = ref();
    const engine = ref();
    const worker = ref();
    const member = ref();
    const staff = ref();
    const security = ref();

    onMounted(() => {
        if (path.startsWith('/markup')) {
            markup.value.checked = true;
        }
        else if (path.startsWith('/engine')) {
            engine.value.checked = true;
        }
        else if (path.startsWith('/worker')) {
            worker.value.checked = true;
        }
        else if (path.startsWith('/member')) {
            member.value.checked = true;
        }
        else if (path.startsWith('/staff')) {
            staff.value.checked = true;
        }
        else if (path.startsWith('/security')) {
            security.value.checked = true;
        }
    });

    const logout = () => {
        authStore.logout()
        .then(() => {
            navigateTo('/login', { replace: true });
            toastNotifier?.success('登出成功');
        })
        .catch((error) => toastNotifier?.error(error))
    }
</script>