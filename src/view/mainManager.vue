<template>
    <div class="main-container absolute w-full h-full xl:px-8 xl:py-4 flex items-center justify-center z-[1] select-none will-change-transform"
        :class="darkMode ? 'bg-[#FAF6F5]/15' : 'bg-[#FAF6F5]/15'">
        <img src="@/assets/All.svg" alt="LOGO"
            class="fixed w-4/5 object-contain filter blur-[14px] pointer-events-none">
        <div class="w-full h-full backdrop-blur-sm border shadow-xl lg:rounded-2xl
        border-[#fcfcfc]/40 select-none overflow-hidden flex justify-start items-center"
            :class="darkMode ? 'bg-[#FAF6F5]/30' : 'bg-[#FAF6F5]/30'">
            <AppSidebar :darkMode="darkMode" class="flex-shrink-0" />
            <!-- 使用网格布局 - 移动设备上是单列，中等及以上屏幕是2x2网格 -->
            <main class="mainEle min-w-[300px] w-full h-full p-4 flex flex-col justify-start
            items-center gap-4 lg:gap-6 overflow-hidden">
                <div class="sticky top-0 w-full h-[7.5%] backdrop-blur-lg rounded-xl bg-white/80 dark:bg-slate-800/60 shadow-md p-4
                transition-all duration-300 hover:shadow-lg flex items-center justify-start z-10">
                    <PanelRightOpen :class="'w-[3rem] h-[3rem]'" class="cursor-pointer rotate-180"
                        @click="toggleSidebar(true)" v-show="!systemStore.sidebarOpen" />
                    <PanelRightClose :class="'w-[3rem] h-[3rem]'" class="cursor-pointer rotate-180"
                        @click="toggleSidebar(false)" v-show="systemStore.sidebarOpen" />
                </div>
                <div class="mainContent *:min-h-[500px] w-full grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 grow">
                    <div ref="serverOverviewDiv"
                        class="col-span-1 lg:col-span-2 order-1 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                        transition-all duration-300 hover:shadow-lg border border-white/20 flex flex-col justify-between">
                        <h2 class="text-xl font-semibold mb-4">服务器概览</h2>
                        <div class="main-card flex flex-col gap-4 rounded-xl w-full h-full">
                        </div>
                    </div>
                    <div
                        class="col-span-1 lg:col-span-2 2xl:col-span-1 order-2 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20 flex flex-col justify-between">
                        <div>
                            <h2 class="text-xl font-semibold mb-4">网站访问量</h2>
                        </div>
                        <AreaChart :data="networkData" index="name" :categories="['total', 'predicted']" />
                    </div>
                    <div
                        class="col-span-1 lg:col-span-2 2xl:col-span-1 order-4 2xl:order-3 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20 w-full h-auto flex flex-col">
                        <h2 class="text-xl font-semibold mb-4">磁盘</h2>
                        <div class="grow flex items-center justify-center">
                            <DonutChart index="name" :category="'total'" :data="distData"
                                :value-formatter="valueFormatter" class="donut-chart" />
                        </div>
                    </div>
                    <div
                        class="col-span-1 lg:col-span-2 bg-white/20 order-3 2xl:order-4 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20 flex flex-col justify-between">
                        <div>
                            <h2 class="text-xl font-semibold mb-4">cpu 内存 网络</h2>
                        </div>
                        <AreaChart :data="systemLineData" index="name" :categories="['total', 'predicted', 'fuck']" />
                    </div>
                    <div
                        class="col-span-1 lg:col-span-4 2xl:col-span-2 order-5 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
                                transition-all duration-300 hover:shadow-lg border border-white/20 flex flex-col justify-between">
                        <div>
                            <h2 class="text-xl font-semibold mb-4">MCP</h2>
                        </div>
                        <BarChart :data="mcpBarData" index="name" :categories="['total', 'predicted']" :y-formatter="(tick, i) => {
                            return typeof tick === 'number'
                                ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                                : ''
                        }" />
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, provide, nextTick } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { PanelRightOpen, PanelRightClose } from "lucide-vue-next"
import { useSystemStore } from '@/stores/system'
import { gsap } from 'gsap'
import { AreaChart } from '@/components/ui/chart-area'
import { BarChart } from '@/components/ui/chart-bar'
import { DonutChart } from '@/components/ui/chart-donut'



const props = defineProps<{
    darkMode?: boolean
}>()

const systemStore = useSystemStore()
const serverOverviewDiv = ref(null);

onMounted(() => {
    gsap.set('.mainEle', {
        marginLeft: systemStore.sidebarOpen ? '340' : '0',
        ease: "power3.out"
    });
    provide('serverOverviewPosition', {
        getPosition: () => {
            if (serverOverviewDiv.value) {
                return serverOverviewDiv.value.getBoundingClientRect();
            }
            return null;
        }
    });
});

watch(() => props.darkMode, (newValue) => {
    if (newValue) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}, { immediate: true });

const systemLineData = [
    { name: 'Jan', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500, fuck: 500 },
    { name: 'Feb', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500, fuck: 500 },
    { name: 'Mar', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500, fuck: 500 },
    { name: 'Apr', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500, fuck: 500 },
    { name: 'May', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500, fuck: 500 },
    { name: 'Jun', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500, fuck: 500 },
    { name: 'Jul', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500, fuck: 500 },
]

const mcpBarData = [
    { name: 'Jan', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Feb', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Mar', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Apr', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'May', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Jun', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Jul', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
]

const networkData = [
    {
        name: 'Jan',
        total: Math.floor(Math.random() * 2000) + 500,
        predicted: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: 'Feb',
        total: Math.floor(Math.random() * 2000) + 500,
        predicted: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: 'Mar',
        total: Math.floor(Math.random() * 2000) + 500,
        predicted: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: 'Apr',
        total: Math.floor(Math.random() * 2000) + 500,
        predicted: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: 'May',
        total: Math.floor(Math.random() * 2000) + 500,
        predicted: Math.floor(Math.random() * 2000) + 500,
    },
    {
        name: 'Jun',
        total: Math.floor(Math.random() * 2000) + 500,
        predicted: Math.floor(Math.random() * 2000) + 500,
    },
]

const distData = [
    {
        name: '剩余空间',
        total: Math.floor(Math.random() * 2000) + 500
    },
    {
        name: '已用空间',
        total: Math.floor(Math.random() * 2000) + 500
    },
    {
        name: '占用空间',
        total: Math.floor(Math.random() * 2000) + 500
    }
]


function valueFormatter(tick: number | Date) {
    return typeof tick === 'number'
        ? `总计 ${new Intl.NumberFormat('us').format(tick).toString()} GB`
        : ''
}

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

watch(() => systemStore.animationId, (newValue) => {
    if (newValue === 'mainIn') {
        nextTick(() => {
            mainIn()
        })
    }
}, { immediate: true })

function mainIn() {
    const tl = gsap.timeline()
    tl.from('.main-container', {
        duration: 0.8,
        y: '-20%',
        filter: 'blur(12px)',
        scale: 0.9,
        opacity: 0,
        ease: "power3.out",
        delay: 0.5,
    })
}



</script>

<style scoped>
.mainEle {
    will-change: margin-left;
}

.donut-chart {
    width: 90%;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.main-card {
    background: linear-gradient(100deg, #f0cfd5, #d5c2e2, #e6d5c2);
}
</style>