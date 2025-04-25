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
                    <Button @click="openAddModal">
                        <Plus class="h-4 w-4 mr-2" />添加服务
                    </Button>
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
                                            <ChevronDown v-if="sortColumn === col.key && sortOrder === 'asc'"
                                                class="h-4 w-4" />
                                            <ChevronUp v-if="sortColumn === col.key && sortOrder === 'desc'"
                                                class="h-4 w-4" />
                                        </div>
                                    </th>
                                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">操作
                                    </th>
                                </tr>
                            </thead>
                            <!-- 表格内容 -->
                            <tbody class="[&_tr:last-child]:border-0">
                                <tr v-for="service in paginatedData" :key="service.id"
                                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td class="p-4 align-middle">{{ service.name }}</td>
                                    <td class="p-4 align-middle">
                                        <span :class="getStatusClass(service.status)"
                                            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                                            {{ service.status }}
                                        </span>
                                    </td>
                                    <td class="p-4 align-middle">{{ service.type }}</td>
                                    <td class="p-4 align-middle">{{ formatDate(service.lastUpdated) }}</td>
                                    <td class="p-4 align-middle text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" @click="toggleService(service)">
                                                <span v-if="service.status === '运行中'">
                                                    <Pause class="h-4 w-4 mr-1" />暂停
                                                </span>
                                                <span v-else>
                                                    <Play class="h-4 w-4 mr-1" />启动
                                                </span>
                                            </Button>
                                            <Button variant="ghost" size="sm" @click="editService(service)">
                                                <Edit class="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" @click="deleteService(service)">
                                                <Trash class="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="paginatedData.length === 0">
                                    <td colspan="8" class="p-8 text-center text-muted-foreground">没有找到匹配的服务</td>
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
import {
    Button
} from '@/components/ui/button';
import {
    Input
} from '@/components/ui/input';
import {
    RefreshCw, ChevronDown, ChevronUp, Plus, Edit, Trash, Play, Pause
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

interface Service {
    id: string;
    name: string;
    status: '已连接' | '已停止' | '错误';
    type: string;
    cpu: number;
    memory: number;
    lastUpdated: Date;
}

// 列定义
const columns = [
    { key: 'name', label: 'Server名称' },
    { key: 'status', label: '连接状态' },
    { key: 'type', label: '描述' },
    { key: 'lastUpdated', label: '最后更新' },
];

// 控制组件状态
const isComponentMounted = ref(false);
const isDataLoading = ref(true);

// 模拟数据
const services = ref<Service[]>([]);

// 生成模拟数据 - 添加错误处理
function generateMockData() {
    try {
        const types = ['Web服务', '计算节点', '数据库', '缓存', '消息队列'];
        const statuses: ('已连接' | '已停止' | '错误')[] = ['已连接', '已停止', '错误'];

        const mockData: Service[] = [];

        for (let i = 1; i <= 20; i++) {
            mockData.push({
                id: `srv-${i.toString().padStart(3, '0')}`,
                name: `MCP-Service-${i}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                type: types[Math.floor(Math.random() * types.length)],
                cpu: Math.floor(Math.random() * 100),
                memory: Math.floor(Math.random() * 1024) + 128,
                lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
            });
        }

        return mockData;
    } catch (error) {
        console.error('生成模拟数据时发生错误:', error);
        return [];
    }
}

// 排序功能
const sortColumn = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');

function sortBy(column: string) {
    if (!isComponentMounted.value) return;

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
    if (!services.value || !services.value.length) return [];

    let result = [...services.value];

    // 应用搜索过滤
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(service =>
            service.id.toLowerCase().includes(query) ||
            service.name.toLowerCase().includes(query) ||
            service.type.toLowerCase().includes(query)
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
function getStatusClass(status: string): string {
    switch (status) {
        case '已连接':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case '已停止':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case '错误':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
}

// 操作函数 - 添加错误处理和组件挂载检查
function toggleService(service: Service) {
    if (!isComponentMounted.value) return;

    try {
        const newStatus = service.status === '运行中' ? '已停止' : '运行中';
        service.status = newStatus;
        toast.success(`服务 ${service.name} 已${newStatus === '运行中' ? '启动' : '停止'}`);
    } catch (error) {
        console.error('切换服务状态时发生错误:', error);
        toast.error('操作失败，请稍后重试');
    }
}

function editService(service: Service) {
    if (!isComponentMounted.value) return;
    toast.info(`编辑服务 ${service.name}`);
}

function deleteService(service: Service) {
    if (!isComponentMounted.value) return;

    try {
        services.value = services.value.filter(s => s.id !== service.id);
        toast.success(`服务 ${service.name} 已删除`);
    } catch (error) {
        console.error('删除服务时发生错误:', error);
        toast.error('删除失败，请稍后重试');
    }
}

function openAddModal() {
    if (!isComponentMounted.value) return;
    toast.info('添加新服务');
}

function refreshData() {
    if (!isComponentMounted.value) return;

    try {
        isDataLoading.value = true;
        // 模拟异步加载
        setTimeout(() => {
            if (!isComponentMounted.value) return;
            services.value = generateMockData();
            isDataLoading.value = false;
            toast.success('数据已刷新');
        }, 300);
    } catch (error) {
        console.error('刷新数据时发生错误:', error);
        isDataLoading.value = false;
        toast.error('刷新失败，请稍后重试');
    }
}

// 生命周期钩子
onMounted(() => {
    isComponentMounted.value = true;
    // 延迟加载数据，确保组件已完全挂载
    nextTick(() => {
        try {
            services.value = generateMockData();
            isDataLoading.value = false;
        } catch (error) {
            console.error('初始化数据时发生错误:', error);
            isDataLoading.value = false;
            toast.error('加载数据失败，请刷新页面重试');
        }
    });
});

// 处理组件卸载
onUnmounted(() => {
    isComponentMounted.value = false;
});
</script>

<style scoped></style>