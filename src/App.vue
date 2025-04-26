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
import logo from "@/assets/logo.svg";
import logoGEAgent from "@/assets/logo+GEAgent.svg";
import all from "@/assets/All.svg";
import GEsvg from "@/assets/GE.svg";
import AGENTsvg from "@/assets/AGENT.svg";
import MyGO from "@/assets/MyGO!!!.svg";
import AllDeep from "@/assets/DEEP-LOGO+GE+AGENT+MyGO.svg";
import defaultAvatar from "@/assets/爱门.jpg";

const themeStore = useThemeStore();
const bgElement = ref(null);

const assetsToPreload = [
    { id: 'logo', url: logo, type: 'image' as ResourceType },
    { id: 'logoGEAgent', url: logoGEAgent, type: 'image' as ResourceType },
    { id: 'all', url: all, type: 'image' as ResourceType },
    { id: 'GE', url: GEsvg, type: 'image' as ResourceType },
    { id: 'AGENT', url: AGENTsvg, type: 'image' as ResourceType  },
    { id: 'MyGO!!!', url: MyGO, type: 'image' as ResourceType },
    { id: 'All-deep', url: AllDeep, type: 'image' as ResourceType },
    { id: 'defaultAvatar', url: defaultAvatar, type: 'image' as ResourceType },
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