<template>
    <div>
        <div @click="toggleStatus" class="cursor-pointer">
            <slot />
        </div>
        <teleport to='body' v-if="isOpen">
            <div class="fixed inset-0 z-20 flex items-center justify-center bg-transparent" @click="closeModal"></div>
            <div class="bg-white/60 dark:bg-gray-800 p-6 shadow-lg absolute border backdrop-blur-md
                top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 min-w-[320px] min-h-[250px] 
                flex flex-col items-center justify-center w-1/5 h-2/5 rounded-xl">
                <div class="w-full h-full flex flex-col items-center justify-between gap-4">
                    <div v-if="type === 'edit'" class="flex flex-col items-start justify-start w-full">
                        <h1 class="text-2xl font-bold">编辑Server信息</h1>
                        <h2 class="text-md font-light text-[#555454]">您可以在此处编辑已添加的MCP Server信息</h2>
                    </div>
                    <div v-if="type === 'add'" class="flex flex-col items-start justify-start w-full">
                        <h1 class="text-2xl font-bold">增加新的Server</h1>
                        <h2 class="text-md font-light text-[#555454]">您可以在此处添加新的的MCP Server</h2>
                    </div>
                    <div class="flex flex-col items-start justify-start w-full gap-6 p-4">
                        <div class="flex items-center justify-center w-full space-x-2">
                            <label for="serverName" class="text-sm font-medium whitespace-nowrap">服务器名称</label>
                            <Input type="text" id="serverName" v-model="localServer.name"
                                class="border rounded-lg p-2 w-full" />
                        </div>
                        <div class="flex items-center justify-center w-full space-x-2">
                            <label for="serverVersion" class="text-sm font-medium whitespace-nowrap">服务器版本</label>
                            <Input type="text" id="serverVersion" v-model="localServer.version"
                                class="border rounded-lg p-2 w-full" />
                        </div>
                        <div class="flex items-center justify-center w-full space-x-2">
                            <label for="serverVersion" class="text-sm font-medium whitespace-nowrap">连接方式</label>
                            <Select v-model="localServer.method">
                                <SelectTrigger>
                                    <SelectValue placeholder="选择MCP Server连接方式" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="stdio">
                                        Stdio
                                    </SelectItem>
                                    <SelectItem value="sse">
                                        SSE
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div v-if="localServer.method === 'stdio'"
                            class="flex items-center justify-center w-full space-x-2">
                            <label for="serverVersion" class="text-sm font-medium whitespace-nowrap">transport
                                command</label>
                            <Input type="text" id="serverVersion" v-model="localServer.transport.command"
                                class="border rounded-lg p-2 w-full" />
                        </div>
                        <div v-if="localServer.method === 'stdio'"
                            class="flex items-center justify-center w-full space-x-2">
                            <label for="serverVersion" class="text-sm font-medium whitespace-nowrap">transport
                                args</label>
                            <Input type="text" id="serverVersion" v-model="localServer.transport.args[0]"
                                class="border rounded-lg p-2 w-full" />
                        </div>
                        <div v-if="localServer.method === 'sse'"
                            class="flex items-center justify-center w-full space-x-2">
                            <label for="serverVersion" class="text-sm font-medium whitespace-nowrap">URL</label>
                            <Input type="text" id="serverVersion" v-model="localServer.transport.url"
                                class="border rounded-lg p-2 w-full" />
                        </div>
                    </div>
                    <div class="flex justify-end w-full gap-2">
                        <button @click="closeModal"
                            class="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            取消
                        </button>
                        <button @click="saveChanges"
                            class="px-4 py-2 bg-rose-400/80 text-white rounded hover:bg-rose-500/80">
                            保存
                        </button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { Edit } from "lucide-vue-next"
import { ref, watch, onMounted, nextTick } from 'vue'
import { useSystemStore } from '@/stores/system'
import { gsap } from 'gsap'
import { toast } from 'vue-sonner'
import { MCPConfigType } from '@/types/systemConfig'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'





const props = defineProps<{
    darkMode?: boolean
    server?: MCPConfigType
    type?: string
}>()

const emit = defineEmits<{
    'add': [payload: { config: MCPConfigType, callback: () => void }];
    'edit': [payload: { config: MCPConfigType, callback: () => void }];
}>();

const isOpen = ref(false)
const localServer = ref<Partial<MCPConfigType>>({
    name: '',
    version: '',
    method: 'stdio',
    transport: {
        command: '',
        args: ['']
    },
    status: {
        state: 'connected',
        error: null,
        toolsCount: 0,
        lastConnected: null,
        lastUpdated: null
    }
})

// 当props.server变化时更新本地数据
watch(() => props.server, (newServer) => {
    if (newServer) {
        localServer.value = newServer
    }
}, { immediate: true })

function toggleStatus() {
    isOpen.value = !isOpen.value
}

function closeModal() {
    isOpen.value = false
}

function saveChanges() {
    if (!localServer.value.name) {
        toast.error('服务器名称不能为空')
        return
    }
    console.log(localServer.value);
    if (props.type === 'edit') {
        emit('edit', {
            config: localServer.value,
            callback: closeModal
        })
    } else {
        emit('add', {
            config: localServer.value,
            callback: closeModal
        })
    }
}
</script>