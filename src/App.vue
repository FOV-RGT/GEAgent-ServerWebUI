<template>
    <Toaster position="bottom-right"  
    :expand="false"
    :richColors="true"
    :closeButton="true"
    :offset="10"
    :duration="5000"
    :theme="themeStore.isDarkMode ? 'dark' : 'light'"
    :hotkey="['altKey', 'KeyT']"
    :visibleToasts="3"/>
    <AuroraBackground class="h-screen w-screen fixed top-0 left-0 z-0" :dark-mode="themeStore.isDarkMode">
        <router-view :dark-mode="themeStore.isDarkMode" />
    </AuroraBackground>
</template>

<script setup lang="ts">
import AuroraBackground from "@/components/ui/aurora-background/AuroraBackground.vue";
import { onMounted } from "vue";
import { useThemeStore } from '@/stores/theme';
import { Toaster } from '@/components/ui/sonner'
import gsap from 'gsap'
import { CustomEase } from "gsap/CustomEase";
import { RoughEase, SlowMo } from "gsap/EasePack";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Draggable } from "gsap/Draggable";

const themeStore = useThemeStore();

onMounted(() => {
    console.log('Current theme:', themeStore.isDarkMode ? 'dark' : 'light');
    gsap.registerPlugin(Flip, ScrollTrigger, ScrollToPlugin, Draggable, RoughEase, SlowMo, CustomEase);
});


</script>

<style scoped></style>