<template>
    <div class="absolute w-full h-full xl:px-8 xl:py-4 flex items-center justify-center z-[1]"
        :class="darkMode ? 'bg-[#FAF6F5]/15' : 'bg-[#FAF6F5]/15'">
        <img src="@/assets/All.svg" alt="LOGO" class="fixed w-4/5 object-contain filter blur-[14px]">
        <div class="w-full h-full backdrop-blur-sm border shadow-xl lg:rounded-2xl
        border-[#fcfcfc]/40 select-none overflow-hidden flex justify-start items-center"
            :class="darkMode ? 'bg-[#FAF6F5]/30' : 'bg-[#FAF6F5]/30'">
            <AppSidebar :darkMode="darkMode" class="flex-shrink-0"/>
            <!-- 使用网格布局 - 移动设备上是单列，中等及以上屏幕是2x2网格 -->
            <main class="mainEle min-w-[300px] w-full h-full p-2 lg:p-4 overflow-auto flex flex-col justify-start
            items-center gap-4 lg:gap-6">
                <div class="sticky top-0 w-full h-[7.5%] backdrop-blur-lg rounded-xl bg-white/80 dark:bg-slate-800/60 shadow-md p-4
                transition-all duration-300 hover:shadow-lg flex items-center justify-start">
                    <PanelRightOpen :class="'w-[3rem] h-[3rem]'" class="cursor-pointer rotate-180" @click="toggleSidebar(true)"
                    v-show="!systemStore.sidebarOpen"/>
                    <PanelRightClose :class="'w-[3rem] h-[3rem]'" class="cursor-pointer rotate-180" @click="toggleSidebar(false)"
                    v-show="systemStore.sidebarOpen"/>
                </div>
                <div class="mainContent *:min-h-[320px] w-full grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 grow">
                    <div class="col-span-2 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20">
                        <h2 class="text-xl font-semibold mb-4">服务器概览</h2>
                        <p>显示服务器基本状态和信息</p>
                    </div>
                    <div class="col-span-2 2xl:col-span-1 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20">
                        <h2 class="text-xl font-semibold mb-4">性能监控</h2>
                        <p>CPU、内存和网络使用情况</p>
                    </div>
                    <div class="col-span-2 2xl:col-span-1 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20">
                        <h2 class="text-xl font-semibold mb-4">性能监控</h2>
                        <p>CPU、内存和网络使用情况</p>
                    </div>
                    <div class="col-span-2 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20">
                        <h2 class="text-xl font-semibold mb-4">服务器概览</h2>
                        <p>查看和管理当前运行的任务</p>
                    </div>
                    <div class="col-span-2 2xl:col-span-1 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20">
                        <h2 class="text-xl font-semibold mb-4">网站浏览量</h2>
                        <p>实时查看系统和应用日志</p>
                    </div>
                    <div class="col-span-2 2xl:col-span-1 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20">
                        <h2 class="text-xl font-semibold mb-4">网站浏览量</h2>
                        <p>实时查看系统和应用日志</p>
                    </div>
                </div>
                <div class="sticky bottom-0 w-full h-[7.5%] rounded-xl bg-white/20 
                dark:bg-slate-800/40 shadow-lg p-4 hover:shadow-xl transition-all duration-300">
                <PanelRightOpen></PanelRightOpen>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { PanelRightOpen, PanelRightClose } from "lucide-vue-next"
import { useSystemStore } from '@/stores/system'
import { gsap } from 'gsap'

const props = defineProps<{
    darkMode?: boolean
}>()

const systemStore = useSystemStore()

onMounted(() => {
    gsap.set('.mainEle', {
        marginLeft: systemStore.sidebarOpen ? '340' : '0',
        ease: "power3.out"
    });
});

watch(() => props.darkMode, (newValue) => {
    if (newValue) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}, { immediate: true });

let sidebarTL = null

function toggleSidebar(isOpen: boolean) {
    systemStore.sidebarOpen = isOpen
    if (sidebarTL) {
        sidebarTL.kill()
    }
    sidebarTL = gsap.timeline()
    if (isOpen) {
        // 当侧边栏打开时，main内容向右移动
        sidebarTL.to('.mainEle', {
            duration: 0.35,
            marginLeft: 340,
            ease: "power3.out",
            onComplete: () => {
                sidebarTL = null
            }
        });
    } else {
        sidebarTL.to('.mainEle', {
            duration: 0.3,
            marginLeft: 0,
            ease: "power2.inOut",
            onComplete: () => {
                sidebarTL = null
            }
        });
    }
}

</script>

<style scoped>
</style>