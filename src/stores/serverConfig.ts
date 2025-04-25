import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { toast } from 'vue-sonner';
import { MCPConfigType } from '@/types/systemConfig';
import api from '@/api/index';

export const useServerConfigStore = defineStore('serverConfig', () => {
    const MCPConfigs = ref<MCPConfigType[]>(null)

    async function getMCPConfigs() {
        try {
            const config = await api.get('/system/clientConfigs')
            MCPConfigs.value = config.data.configs
            toast.success('获取配置成功', {
                description: '配置已成功加载',
            })
        } catch (err) { 
            toast.error('获取配置失败', {
                description: `${err.data.message}`,
            })
        }
    }

    return { 
        MCPConfigs,
        getMCPConfigs,
    }
})