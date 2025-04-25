import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { toast } from 'vue-sonner';
import { MCPConfigType } from '@/types/systemConfig';
import api from '@/api/index';

export const useServerConfigStore = defineStore('serverConfig', () => {
    const MCPConfigs = ref<MCPConfigType[]>([])

    async function getMCPConfigs() {
        try {
            const res = await api.get('/system/clientConfigs')
            MCPConfigs.value = res.data.configs
            toast.success('获取配置成功', {
                description: '配置已成功加载',
            })
        } catch (err) { 
            toast.error('获取配置失败', {
                description: `${err.data.message}`,
            })
        }
    }

    async function init() {
        try {
            await getMCPConfigs()
        } catch (err) { 
            toast.error('初始化配置失败', {
                description: `${err.data.message}`,
            })
        }
    }

    async function updateMCPConfig(config: MCPConfigType) {
        try {
            const index = MCPConfigs.value.findIndex(s => s.name === config.name);
            if (index !== -1) {
                MCPConfigs.value[index] = config;
                const res = await api.post('/system/updateClientConfigs', JSON.stringify({
                    configs: MCPConfigs.value
                }))
                toast.success(res.data.message);
            } else {
                toast.error('无法更新服务，数据不存在');
            }
        } catch (error) {
            console.error('更新服务时发生错误:', error);
            toast.error('更新失败，请稍后重试');
        }
    }

    async function addMCPConfig(config) {
        try {
            MCPConfigs.value.push(config)
            const res = await api.post('/system/updateClientConfigs', JSON.stringify({
                configs: MCPConfigs.value
            }))
            toast.success(res.data.message);
        } catch (err) {
            toast.error('添加配置失败', {
                description: `${err.data.message}`,
            })
        }
    }

    async function deleteMCPConfig(name: string) {
        try {
            MCPConfigs.value = MCPConfigs.value.filter(s => s.name !== name);
            const res = await api.post('/system/updateClientConfigs', JSON.stringify({
                configs: MCPConfigs.value
            }))
            toast.success(res.data.message);
        } catch (error) {
            console.error('删除服务时发生错误:', error);
            toast.error('删除失败，请稍后重试');
        }
    }

    return { 
        MCPConfigs,
        getMCPConfigs,
        init,
        updateMCPConfig,
        addMCPConfig,
        deleteMCPConfig
    }
})