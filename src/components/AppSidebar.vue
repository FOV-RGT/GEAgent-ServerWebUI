<template>
    <div class="sidebar-container">
        <div class="sidebar absolute flex flex-col top-0 left-0 w-full h-full backdrop-blur-md shadow-2xl rounded-2xl"
            :class="props.darkMode ? 'bg-[#161725]/30' : 'bg-[#F9F7F7]/10'">
            <div class="sticky w-full h-[80px] top-0 flex items-center px-2 mb-6 z-10">
                <img src="@/assets/logo+GEAgent.svg" alt="LOGO">
            </div>
            <div class="relative w-full h-full px-10 flex flex-col justify-start items-center gap-16 z-10">
                <button v-for="(item, index) in menus" :key="index" class="menuButton menu-item-3d w-full h-24 rounded-[20px] text-2xl font-medium
                    backdrop-blur-md shadow-lg" @click="handleMenuClick(item.view)">
                    <div class="flex items-center justify-center gap-3">
                        <component :is="item.icon" class="w-6 h-6" />
                        <span>{{ item.title }}</span>
                    </div>
                </button>
            </div>
            <div class="sticky w-full h-[120px] bottom-0 backdrop-blur-sm rounded-2xl z-5">
                <!-- 底部内容 -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Home, Server, Search, Settings } from "lucide-vue-next"
import { onMounted, ref, watch, onUnmounted, defineEmits } from 'vue'
import { useSystemStore } from '@/stores/system'
import { gsap } from 'gsap'


const props = defineProps<{
    darkMode?: boolean
}>()
const systemStore = useSystemStore()
const emit = defineEmits(['toggleView'])



const menus = [
    {
        title: "概览",
        view: "Overview",
        icon: Home,
    },
    {
        title: "MCP",
        view: "MCPManager",
        icon: Server,
    },
    {
        title: "设置",
        view: "Settings",
        icon: Settings,
    }
];

let sidebarTL = null

onMounted(() => {
    gsap.set('.sidebar-container', {
        x: systemStore.sidebarOpen ? 0 : '-100%',
        rotateY: systemStore.sidebarOpen ? 4 : 20,
        translateZ: systemStore.sidebarOpen ? -2 : 20
    });
    sidebarAnimation(systemStore.sidebarOpen);
});

watch(() => systemStore.sidebarOpen, (newValue) => sidebarAnimation(newValue));


function sidebarAnimation(isOpen: boolean) {
    if (sidebarTL) {
        sidebarTL.kill();
    }
    sidebarTL = gsap.timeline();
    if (isOpen) {
        sidebarTL.to('.sidebar-container', {
            duration: 0.35,
            x: 0,
            rotateY: 4,
            translateZ: -2,
            ease: "power3.out",
            onComplete: () => {
                sidebarTL = null;
            }
        });
    } else {
        // 侧边栏关闭动画
        sidebarTL.to('.sidebar-container', {
            duration: 0.3,
            x: '-100%',
            rotateY: 20,
            translateZ: 20,
            ease: "power2.inOut",
            onComplete: () => {
                sidebarTL = null;
            }
        });
    }
}

function handleMenuClick(view) {
    emit('toggleView', view)
}


</script>

<style scoped>
.sidebar-container {
    perspective: 800px;
    position: absolute;
    min-width: 340px;
    height: 100%;
    transform: perspective(800px);
    will-change: rotateY, translateZ, opacity;
    transform-style: preserve-3d;
}

.sidebar {
    transform-style: preserve-3d;
    transition: transform 0.5s ease-out;
}

.menu-item-3d {
    transition: all 0.2s ease;
}

.menu-item-3d:hover {
    transform: translateX(2px) translateY(6px) scale(1.04);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.menuButton {
    background: linear-gradient(135deg, rgba(251, 188, 5, 0.1), rgba(234, 67, 53, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: black;
}

/* 深色模式下的按钮样式 */
:root.dark .menuButton {
    background: linear-gradient(135deg, rgba(251, 188, 5, 0.15), rgba(234, 67, 53, 0.15));
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow:
        0 4px 15px rgba(0, 0, 0, 0.2),
        0 6px 2px -4px rgba(0, 0, 0, 0.15);
    color: white;
}
</style>