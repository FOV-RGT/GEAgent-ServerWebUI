<template>
    <div class="fixed w-full h-full top-0 flex flex-row justify-start z-50">
        <div class="flex flex-col w-[35%] h-full rounded-r-2xl z-10 p-6"
            :class="darkMode ? 'bg-[#161725]/90 text-white' : 'left-card text-gray-800'">
            <div class="left-card-content flex flex-col items-center justify-center h-full space-y-8 select-none">
                <!-- <img src="@/assets/亮色logo.png" alt="Logo" class="w-full mx-auto mt-4 mb-2 shadow-lg"> -->
                <h1 class="text-6xl tracking-wide">GEAgent</h1>
                <h2 class="text-3xl tracking-wide">Server-WebUI</h2>
            </div>
        </div>
        <div class="p-4 flex flex-col justify-center items-center h-full w-[66%] right-0 min-w-[360px]">
            <!-- 卡片标题 -->
            <div class="right-login-card backdrop-blur-md border shadow-xl rounded-xl p-6 w-full max-w-md mx-auto"
                :class="darkMode ? 'bg-gray-900/60 border-white/20' : 'bg-[#F9F7F7]/75 border-white/20'">
                <h2 class="mountedAnimation text-2xl font-medium text-center mb-6 tracking-[0.5em] select-none"
                    :class="darkMode ? 'text-white' : 'text-gray-800'">登录</h2>
                <loginForm />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { defineProps } from 'vue';
import loginForm from '@/components/loginForm.vue';
import { Button } from '@/components/ui/button'
import gsap from 'gsap';
import { toast } from 'vue-sonner'

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

onMounted(() => {
    // 创建更精细的时间线
    const tl = gsap.timeline({
        defaults: {
            duration: 0.85,
            ease: "power3.out"
        },
        onComplete: () => {
            toast.info('It\'s MyGO!!!', {
                description: '欢迎使用 GEAgent Server-WebUI',
            })
        }
    });

    tl.from('.left-card-content h1', {
        y: 30,
        opacity: 0,
        filter: "blur(12px)",
        duration: 0.7
    });

    tl.from('.left-card-content h2', {
        y: 20,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.6
    }, "-=0.5");

    tl.from('.backdrop-blur-md', {
        opacity: 0,
        filter: "blur(15px)",
        scale: 0.92,
        y: 15,
        transformOrigin: "center center",
        duration: 0.7,
        clearProps: "all" // 确保动画结束后清除所有属性，避免性能问题
    }, "-=0.3");

    tl.from('.mountedAnimation > *', {
        opacity: 0,
        y: 10, 
        filter: "blur(5px)",
        stagger: 0.1,
        duration: 0.5
    }, "-=0.55");
});

</script>

<style scoped>
@import url('@/css/login.css');
</style>