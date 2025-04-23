<template>
    <div class="absolute w-full h-full px-6 py-4 flex items-center justify-center border border-[#fcfcfc]/60"
    :class="darkMode ? 'bg-[#FAF6F5]' : 'bg-[#FAF6F5]/30'">
        <div class="w-full h-full backdrop-blur-xl border shadow-xl rounded-2xl p-6 border-[#fcfcfc]/60 select-none"
        :class="darkMode ? 'bg-[#FAF6F5]' : 'bg-[#FAF6F5]/50'">
        
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { defineProps } from 'vue';



const props = defineProps<{
    darkMode?: Boolean
}>()

watch(() => props.darkMode, (newValue) => {
    if (newValue) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}, { immediate: true });

</script>

<style scoped></style>