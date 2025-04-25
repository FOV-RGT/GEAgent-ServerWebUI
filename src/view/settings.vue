<template>
    <div class="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-5 pb-4">
        <!-- 主题设置 -->
        <div
            class="backdrop-blur-md border shadow-md rounded-xl transition-all duration-300 hover:shadow-lg border-white/20 dark:bg-slate-800/40 bg-white/30">
            <div class="flex items-center gap-2 p-4 border-b border-border/40">
                <Palette class="h-5 w-5" />
                <h2 class="text-lg font-medium">外观</h2>
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between">
                    <span>主题模式</span>
                    <Select v-model="currentTheme" @update:modelValue="updateTheme">
                        <option value="system">跟随系统</option>
                        <option value="light">浅色</option>
                        <option value="dark">深色</option>
                    </Select>
                </div>
                <Separator class="my-4" />
                <div class="flex items-center justify-between">
                    <span>界面动画</span>
                    <Switch v-model="enableAnimations" />
                </div>
                <Separator class="my-4" />
                <div class="flex items-center justify-between">
                    <span>背景模糊度</span>
                    <Slider v-model="blurLevel" :min="0" :max="20" :step="1" class="w-1/2" />
                </div>
            </div>
        </div>
        <!-- 账户设置 -->
        <div
            class="backdrop-blur-md border shadow-md rounded-xl transition-all duration-300 hover:shadow-lg border-white/20 dark:bg-slate-800/40 bg-white/30">
            <div class="flex items-center gap-2 p-4 border-b border-border/40 justify-between">
                <div class="flex flex-row items-center gap-2">
                    <UserCog class="h-5 w-5" />
                    <h2 class="text-lg font-medium">账户</h2>
                </div>
                <Button variant="outline" size="sm" @click="resetSettings"
                    class="backdrop-blur-sm bg-white/30 dark:bg-slate-800/40 border-white/20">
                    <RotateCcw class="h-4 w-4 mr-2" />
                    重置设置
                </Button>
            </div>
            <div class="p-4">
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src="https://avatars.githubusercontent.com/u/124599" />
                            <AvatarFallback>管理员</AvatarFallback>
                        </Avatar>
                        <div class="flex flex-col">
                            <span class="font-medium">管理员用户</span>
                            <span class="text-sm text-muted-foreground">admin@example.com</span>
                        </div>
                    </div>
                    <Separator />
                    <Button variant="outline" size="sm" class="w-full">
                        <KeyRound class="h-4 w-4 mr-2" />
                        修改密码
                    </Button>
                </div>
            </div>
        </div>
        <!-- 服务器设置 -->
        <div
            class="backdrop-blur-md border shadow-md rounded-xl transition-all duration-300 hover:shadow-lg border-white/20 dark:bg-slate-800/40 bg-white/30">
            <div class="flex items-center gap-2 p-4 border-b border-border/40">
                <ServerCog class="h-5 w-5" />
                <h2 class="text-lg font-medium">服务器</h2>
            </div>
            <div class="p-4 space-y-4">
                <div class="flex items-center justify-between">
                    <span>调试模式</span>
                    <Switch v-model="debugMode" />
                </div>
                <Separator />
                <div class="flex items-center justify-between">
                    <span>自动备份</span>
                    <Switch v-model="autoBackup" />
                </div>
                <Separator />
                <div class="flex items-center justify-between">
                    <span>通知</span>
                    <Switch v-model="enableNotifications" />
                </div>
            </div>
        </div>
        <!-- 数据管理 -->
        <div
            class="backdrop-blur-md border shadow-md rounded-xl transition-all duration-300 hover:shadow-lg border-white/20 dark:bg-slate-800/40 bg-white/30">
            <div class="flex items-center gap-2 p-4 border-b border-border/40">
                <Database class="h-5 w-5" />
                <h2 class="text-lg font-medium">数据管理</h2>
            </div>
            <div class="p-4">
                <div class="space-y-4">
                    <p class="text-sm text-muted-foreground">
                        管理应用数据和缓存，清理可能会导致临时性能下降
                    </p>
                    <div class="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                            <Trash2 class="h-4 w-4 mr-2" />
                            清理缓存
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download class="h-4 w-4 mr-2" />
                            导出数据
                        </Button>
                        <Button variant="outline" size="sm">
                            <HardDrive class="h-4 w-4 mr-2" />
                            备份设置
                        </Button>
                        <Button variant="outline" size="sm">
                            <Upload class="h-4 w-4 mr-2" />
                            恢复设置
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 关于 -->
        <div
            class="backdrop-blur-md border shadow-md rounded-xl transition-all duration-300 hover:shadow-lg border-white/20 dark:bg-slate-800/40 bg-white/30 col-span-1 lg:col-span-2 flex flex-col overflow-visible self-end shrink-0">
            <div class="flex items-center gap-2 p-4 border-b border-border/40 flex-shrink-0">
                <Info class="h-5 w-5" />
                <h2 class="text-lg font-medium">关于</h2>
            </div>
            <div class="p-4 flex-shrink-0">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="font-medium">GEAgent Server-WebUI</h3>
                        <p class="text-sm text-muted-foreground">版本 {{ packageJson.version }}</p>
                    </div>
                    <Button variant="outline" size="sm">
                        <ExternalLink class="h-4 w-4 mr-2" />
                        检查更新
                    </Button>
                </div>
                <Separator class="my-4" />
                <div class="text-sm text-muted-foreground">
                    <p>© 2025 MyGO!!! Team 保留所有权利。</p>
                    <p class="mt-2">It's MyGO!!!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useThemeStore } from '@/stores/theme';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    Palette,
    UserCog,
    ServerCog,
    Database,
    Trash2,
    Download,
    Upload,
    HardDrive,
    Info,
    ExternalLink,
    RotateCcw,
    KeyRound
} from 'lucide-vue-next';
import packageJson from '@/../package.json';




const themeStore = useThemeStore();
const currentTheme = ref(themeStore.theme);
const enableAnimations = ref(true);
const blurLevel = ref(10);
const debugMode = ref(false);
const autoBackup = ref(true);
const enableNotifications = ref(true);

function updateTheme(theme: string) {
    themeStore.setTheme(theme as 'light' | 'dark' | 'system');
    toast.success('主题已更新', {
        description: `已切换到${theme === 'system' ? '跟随系统' : theme === 'light' ? '浅色' : '深色'}模式`
    });
}

function resetSettings() {
    // 确认对话框
    if (confirm('确定要重置所有设置吗？这将恢复默认值。')) {
        // 重置所有设置
        currentTheme.value = 'system';
        enableAnimations.value = true;
        blurLevel.value = 10;
        debugMode.value = false;
        autoBackup.value = true;
        enableNotifications.value = true;

        // 更新主题
        themeStore.setTheme('system');

        toast.success('设置已重置', {
            description: '所有设置已恢复默认值'
        });
    }
}
</script>

<style scoped></style>