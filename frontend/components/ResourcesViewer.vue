<template>
    <PopUp ref="popUp" containerClass="flex flex-col w-4/5 max-w-2xl overflow-hidden bg-white rounded-lg">
        <div class="flex h-full flex-1 flex-col p-2 gap-2 overflow-auto md:p-4">
            <button class="flex justify-end" @click="popUp?.close()">
                <FAIcon :icon="['fas', 'xmark']" class="min-w-[32px] min-h-[32px]"/>
            </button>
            <div class="flex flex-col gap-3 overflow-auto">
                <Swiper v-if="resources?.length" class="w-full overflow-hidden"
                :space-between="50" navigation :modules="[Navigation]" @swiper="setSwiper">
                    <SwiperSlide v-for="it, index in resources" :key="index"
                    class="flex items-center justify-center">
                        <div class="flex items-center justify-center overflow-hidden">
                            <img :src="it.content" class="w-full object-contain" v-if="it?.mime_type?.includes('image')"/>
                            <video :src="it.content" controls class="w-full object-contain" v-if="it?.mime_type?.includes('video')"/>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div class="flex justify-center text-sm">
                <span>{{ `第${activeIndex + 1}筆，共${resources?.length ?? 0}筆` }}</span>
            </div>
        </div>
    </PopUp>
</template>
<script setup lang="ts">
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation } from 'swiper';
    import _ from 'lodash';
    import 'swiper/css';
    import 'swiper/css/navigation';
    import 'swiper/css/thumbs';

    interface Props {
        resources: {
            name: string,
            content: string,
            mime_type: string,
        }[],
    }

    const props = defineProps<Props>();

    const popUp = ref();
    const swiper = ref();
    const activeIndex = ref();

    watch(() => swiper.value, _.debounce(() => {
        activeIndex.value = swiper.value?.activeIndex;
    }, 10), { deep: true });

    const setSwiper = (s: any) => swiper.value = s;

    const close = () => {
        popUp.value?.close();
    };

    const show = (index: 0) => {
        swiper.value.activeIndex = index;
        popUp.value?.show();
    };

    defineExpose({ show, close });
</script>