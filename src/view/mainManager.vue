<template>
    <div class="main-container absolute w-full h-full xl:px-8 xl:py-4 flex items-center justify-center z-[1] select-none will-change-transform"
        :class="darkMode ? 'bg-[#FAF6F5]/15' : 'bg-[#FAF6F5]/15'">
        <img src="@/assets/All.svg" alt="LOGO"
            class="fixed w-4/5 object-contain filter blur-[14px] pointer-events-none">
        <div class="w-full h-full backdrop-blur-sm border shadow-xl lg:rounded-2xl
        border-[#fcfcfc]/40 select-none overflow-hidden flex justify-start items-center"
            :class="darkMode ? 'bg-[#FAF6F5]/30' : 'bg-[#FAF6F5]/30'">
            <AppSidebar :darkMode="darkMode" class="flex-shrink-0" @toggleView="toggleView" />
            <main class="mainEle min-w-[300px] w-full h-full p-4 flex flex-col justify-start
            items-center gap-4 lg:gap-6 overflow-y-auto overflow-x-hidden">
                <div class="sticky top-0 w-full h-[7.5%] backdrop-blur-lg rounded-xl bg-white/80 dark:bg-slate-800/60 shadow-md p-4
                transition-all duration-300 hover:shadow-lg flex items-center justify-between z-10">
                    <PanelRightOpen :class="'w-[3rem] h-[3rem]'" class="cursor-pointer rotate-180"
                        @click="toggleSidebar(true)" v-show="!systemStore.sidebarOpen" />
                    <PanelRightClose :class="'w-[3rem] h-[3rem]'" class="cursor-pointer rotate-180"
                        @click="toggleSidebar(false)" v-show="systemStore.sidebarOpen" />
                    <h1 class="text-2xl font-semibold text-center">{{ currentTitle() }}</h1>
                    <Avatar>
                        <AvatarImage :src="getPreRes('defaultAvatar')" />
                        <AvatarFallback>管理员头像</AvatarFallback>
                    </Avatar>
                </div>
                <Transition name="fade" mode="out-in" class="mainContent  w-full h-full">
                    <component :is="componentMap[currentView]" :darkMode="darkMode" />
                </Transition>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, defineAsyncComponent } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { PanelRightOpen, PanelRightClose } from "lucide-vue-next"
import { useSystemStore } from '@/stores/system'
import { gsap } from 'gsap'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { preloader } from "@/services/preloader";




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

const ServerOverview = defineAsyncComponent(() =>
    import('@/view/overview.vue')
)

const MCPManager = defineAsyncComponent(() =>
    import('@/view/MCPManager.vue')
)

const Settings = defineAsyncComponent(() =>
    import('@/view/settings.vue')
)

const currentView = ref('Overview')

const componentMap = {
    'Overview': ServerOverview,
    'MCPManager': MCPManager,
    'Settings': Settings
}

const serverOverviewDiv = ref(null)

function toggleView(view) {
    console.log(view);
    currentView.value = view
}

function currentTitle() {
    const titles = {
        'Overview': '信息概览',
        'MCPManager': 'MCP Server管理',
        'Settings': '设置'
    }
    return titles[currentView.value] || '概览'
}


function getPreRes(id) {
    const resource = preloader.resources.find(r => r.id === id)
    return resource && resource.loaded ? resource.url : ''
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>