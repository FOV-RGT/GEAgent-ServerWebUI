<template>
    <div class="w-full h-full">
        <div class="flex flex-col gap-4 w-full h-full">
            <div class="flex justify-end items-center mb-4">
                <div class="flex items-center gap-2">
                    <Input placeholder="搜索..." v-model="searchQuery" class="w-auto" />
                    <Button variant="outline" size="sm" @click="refreshData" :disabled="isDataLoading">
                        <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': isDataLoading }" />
                        {{ isDataLoading ? '加载中...' : '刷新' }}
                    </Button>
                    <editComponent :darkMode="darkMode" @add="addServer" type="add">
                        <Button>
                            <Plus class="h-4 w-4 mr-2" />添加服务
                        </Button>
                    </editComponent>
                </div>
            </div>
            <div v-if="isDataLoading && !services.length" class="w-full flex justify-center items-center py-20">
                <div class="flex flex-col items-center">
                    <RefreshCw class="h-10 w-10 animate-spin mb-4 text-gray-400" />
                    <span class="text-gray-500">加载数据中...</span>
                </div>
            </div>
            <!-- 表格 -->
            <div v-else class="rounded-md border bg-card">
                <div class="relative w-full h-full overflow-auto">
                    <div class="relative w-full overflow-auto">
                        <table class="w-full caption-bottom text-sm">
                            <!-- 表头 -->
                            <thead class="[&_tr]:border-b">
                                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th v-for="col in columns" :key="col.key"
                                        class="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                                        @click="sortBy(col.key)">
                                        <div class="flex items-center gap-1">
                                            {{ col.label }}
                                            <ChevronDown v-show="sortColumn === col.key && sortOrder === 'asc'"
                                                class="h-4 w-4" />
                                            <ChevronUp v-show="sortColumn === col.key && sortOrder === 'desc'"
                                                class="h-4 w-4" />
                                        </div>
                                    </th>
                                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">操作
                                    </th>
                                </tr>
                            </thead>
                            <!-- 表格内容 -->
                            <tbody class="border">
                                <tr v-for="(server, index) in paginatedData" :key="index"
                                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td class="p-4 align-middle">{{ server.name }}</td>
                                    <td class="p-4 align-middle">{{ server.version }}</td>
                                    <td class="p-4 align-middle">{{ server.method }}</td>
                                    <td class="p-4 align-middle">
                                        <span :class="getStateClass(server.status.state)"
                                            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                                            {{ server.status.state }}
                                        </span>
                                    </td>
                                    <td class="p-4 align-middle">{{ server.description }}</td>
                                    <td class="p-4 align-middle">{{ formatDate(server.status.lastUpdated) }}</td>
                                    <td class="p-4 align-middle text-right">
                                        <div class="flex items-center justify-end gap-4">
                                            <div @click="toggleServer(server)" class="cursor-pointer">
                                                <span v-if="server.status.state === 'connected'">
                                                    <Pause />
                                                </span>
                                                <span v-else>
                                                    <Play />
                                                </span>
                                            </div>
                                            <editComponent :darkMode="darkMode" :server="server" @edit="updateServer" type="edit">
                                                <Edit class="cursor-pointer" />
                                            </editComponent>
                                            <Trash class="cursor-pointer" @click="deleteServer(server)" />
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="paginatedData.length === 0">
                                    <td colspan="8" class="p-8 text-center text-muted-foreground">暂未配置MCP Server</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- 分页 -->
                    <div class="flex items-center justify-between px-4 py-4">
                        <div class="text-sm text-muted-foreground">
                            显示 {{ paginatedData.length }} 项，共 {{ filteredData.length }} 项
                        </div>
                        <div class="flex items-center gap-2">
                            <Button variant="outline" size="sm" :disabled="currentPage === 1" @click="currentPage--">
                                上一页
                            </Button>
                            <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
                            <Button variant="outline" size="sm" :disabled="currentPage === totalPages"
                                @click="currentPage++">
                                下一页
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, ChevronDown, ChevronUp, Plus, Trash, Play, Pause, Edit } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useServerConfigStore } from '@/stores/serverConfig';
import { MCPConfigType } from '@/types/systemConfig';
import editComponent from '@/components/editComponent.vue';





const serverConfigStore = useServerConfigStore();

const props = defineProps<{
    darkMode?: boolean
}>();


onMounted(async () => {
    try {
        isDataLoading.value = true;
        await serverConfigStore.init();
        isDataLoading.value = false;
    } catch (error) {
        console.error('初始化数据时发生错误:', error);
        isDataLoading.value = false;
        toast.error('加载数据失败，请刷新页面重试');
    }
});

// 列定义
const columns = [
    { key: 'name', label: 'Server名称' },
    { key: 'lastUpdated', label: '版本' },
    { key: 'lastUpdated', label: '连接方式' },
    { key: 'status', label: '连接状态' },
    { key: 'type', label: '描述' },
    { key: 'lastUpdated', label: '最后更新' },
];

const isDataLoading = ref(true);

const services = ref<Service[]>([]);

// 排序功能
const sortColumn = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');

function sortBy(column: string) {
    if (sortColumn.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn.value = column;
        sortOrder.value = 'asc';
    }
}

// 搜索功能
const searchQuery = ref('');

// 分页功能
const pageSize = 20;
const currentPage = ref(1);

// 计算属性：过滤后的数据
const filteredData = computed(() => {
    const MCPConfigs = serverConfigStore.MCPConfigs;
    if (!MCPConfigs || !MCPConfigs.length) return [];
    let result = [...MCPConfigs];
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(config =>
            config.name.includes(query)
        );
    }

    // 应用排序
    if (sortColumn.value) {
        result.sort((a, b) => {
            try {
                const aValue = a[sortColumn.value as keyof Service];
                const bValue = b[sortColumn.value as keyof Service];
                if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
                return 0;
            } catch (error) {
                console.error('排序时发生错误:', error);
                return 0;
            }
        });
    }

    return result;
});

// 计算属性：分页后的数据
const paginatedData = computed(() => {
    if (!filteredData.value.length) return [];
    const start = (currentPage.value - 1) * pageSize;
    return filteredData.value.slice(start, start + pageSize);
});

// 计算属性：总页数
const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredData.value.length / pageSize))
);

// 格式化日期
function formatDate(date: Date): string {
    if (!date) return '---';
    try {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (error) {
        console.error('格式化日期时发生错误:', error);
        return '---';
    }
}

// 根据状态获取样式类
function getStateClass(state) {
    switch (state) {
        case 'connected':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'disconnected':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'error':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
}

// 操作函数 - 添加错误处理和组件挂载检查
async function toggleServer(server) {
    try {
        const newState = server.status.state === 'connected' ? 'disconnected' : 'connected';
        server.status.state = newState;
        await serverConfigStore.updateMCPConfig(server);
        toast.success(`服务 ${server.name} 已${newState === 'connected' ? '启动' : '停止'}`);
    } catch (error) {
        console.error('切换服务状态时发生错误:', error);
        toast.error('操作失败，请稍后重试');
    }
}

async function updateServer({ config, callback }) {
    await serverConfigStore.updateMCPConfig(config)
    callback()
}

async function addServer({ config, callback }) {
    await serverConfigStore.addMCPConfig(config)
    callback()
}

async function deleteServer(server) {
    await serverConfigStore.deleteMCPConfig(server.name)
}

async function refreshData() {
    try {
        isDataLoading.value = true;
        await serverConfigStore.getMCPConfigs()
        isDataLoading.value = false
    } catch (error) {
        console.error('刷新数据时发生错误:', error);
        isDataLoading.value = false;
        toast.error('刷新失败，请稍后重试');
    }
}



</script>

<style scoped></style>