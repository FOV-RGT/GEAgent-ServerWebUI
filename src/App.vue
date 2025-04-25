<template>
    <Toaster position="bottom-right" :expand="false" :richColors="true" :closeButton="true" :offset="10"
        :duration="5000" :theme="themeStore.isDarkMode ? 'dark' : 'light'" :hotkey="['altKey', 'KeyT']"
        :visibleToasts="3" />
    <AuroraBackground class="h-screen w-screen fixed top-0 left-0 z-0" :dark-mode="themeStore.isDarkMode">
        <!-- 动画背景元素 -->
        <bgEle ref="bgElement" class="fixed z-10 w-full h-full" />
        <router-view :dark-mode="themeStore.isDarkMode" />
    </AuroraBackground>
</template>

<script setup lang="ts">
import AuroraBackground from "@/components/ui/aurora-background/AuroraBackground.vue";
import { ref, onBeforeMount, onMounted } from "vue";
import { useThemeStore } from '@/stores/theme';
import { Toaster } from '@/components/ui/sonner'
import gsap from 'gsap'
import { CustomEase } from "gsap/CustomEase";
import { RoughEase, SlowMo } from "gsap/EasePack";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Draggable } from "gsap/Draggable";
import bgEle from "@/components/bgEle.vue";
import { preloader, ResourceType } from "@/services/preloader";

const themeStore = useThemeStore();
const bgElement = ref(null);
const appReady = ref(false);

const assetsToPreload = [
    { id: 'logo', url: '/src/assets/logo.svg', type: 'image' },
    { id: 'logoGEAgent', url: '/src/assets/logo+GEAgent.svg', type: 'image' },
    { id: 'all', url: '/src/assets/All.svg', type: 'image' },
    { id: 'GE', url: '/src/assets/GE.svg', type: 'image' },
    { id: 'AGENT', url: '/src/assets/AGENT.svg', type: 'image' },
    { id: 'MyGO!!!', url: '/src/assets/MyGO!!!.svg', type: 'image' },
    { id: 'All-deep', url: '/src/assets/DEEP-LOGO+GE+AGENT+MyGO.svg', type: 'image' },
]

onBeforeMount(() => {
    gsap.registerPlugin(Flip, ScrollTrigger, ScrollToPlugin, Draggable, RoughEase, SlowMo, CustomEase);
    preloader.addResources(assetsToPreload);
    preloader.loadAll();
})


onMounted(() => {
    console.log('目前主题:', themeStore.isDarkMode ? '暗色' : '亮色');
});


</script>

<style scoped></style>