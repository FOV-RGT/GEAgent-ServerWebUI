<template>
    <div class="w-full h-full grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 *:min-h-[500px]">
        <div ref="serverOverviewDiv" class="order-1 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
        hover:shadow-lg border border-white/20 flex flex-col justify-between col-span-1 lg:col-span-2">
            <h2 class="text-xl font-semibold mb-4">信息概览</h2>
            <div class="main-card flex flex-col gap-4 rounded-xl w-full h-full">
            </div>
        </div>
        <div class="col-span-1 lg:col-span-2 2xl:col-span-1 order-2 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
        transition-all duration-300 hover:shadow-lg border border-white/20 flex flex-col justify-between">
            <div>
                <h2 class="text-xl font-semibold mb-4">网站访问量</h2>
            </div>
            <AreaChart :data="networkData" index="name" :categories="['total', 'predicted']" />
        </div>
        <div class="col-span-1 lg:col-span-2 2xl:col-span-1 order-4 2xl:order-3 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
        transition-all duration-300 hover:shadow-lg border border-white/20 w-full h-auto flex flex-col">
            <h2 class="text-xl font-semibold mb-4">磁盘</h2>
            <div class="grow flex items-center justify-center">
                <DonutChart index="name" :category="'total'" :data="distData" :value-formatter="valueFormatter"
                    class="donut-chart" />
            </div>
        </div>
        <div class="col-span-1 lg:col-span-2 bg-white/20 order-3 2xl:order-4 dark:bg-slate-800/40 rounded-xl shadow-md p-4
        transition-all duration-300 hover:shadow-lg border border-white/20 flex flex-col justify-between">
            <div>
                <h2 class="text-xl font-semibold mb-4">cpu 内存 网络</h2>
            </div>
            <AreaChart :data="systemLineData" index="name" :categories="['total', 'predicted', 'fuck']" />
        </div>
        <div class="col-span-1 lg:col-span-4 2xl:col-span-2 order-5 bg-white/20 dark:bg-slate-800/40 rounded-xl shadow-md p-4
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, defineAsyncComponent } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { PanelRightOpen, PanelRightClose } from "lucide-vue-next"
import { useSystemStore } from '@/stores/system'
import { gsap } from 'gsap'
import { AreaChart } from '@/components/ui/chart-area'
import { BarChart } from '@/components/ui/chart-bar'
import { DonutChart } from '@/components/ui/chart-donut'
import { Flip } from "gsap/Flip";



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

</script>

<style scoped>
.main-card {
    background: linear-gradient(100deg, #f0cfd5, #d5c2e2, #e6d5c2);
}



.donut-chart {
    width: 90%;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>