<template>
    <AuroraBackground class="h-screen w-screen fixed top-0 left-0 z-0" :dark-mode="themeStore.isDarkMode">
        <router-view/>
    </AuroraBackground>
</template>

<script setup lang="ts">
import AuroraBackground from "@/components/ui/aurora-background/AuroraBackground.vue";
import { onMounted } from "vue";
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

onMounted(() => {
    console.log('Current theme:', themeStore.isDarkMode ? 'dark' : 'light');
});
</script>

<style scoped></style>