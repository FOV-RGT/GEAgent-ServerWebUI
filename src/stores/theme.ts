import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
    // 用户主题偏好
    const storedTheme = localStorage.getItem('theme') as Theme || 'system'
    const theme = ref<Theme>(storedTheme)
    console.log('theme', theme.value);
    
    // 当前应用的主题
    const isDarkMode = ref(false)
    
    // 实际应用主题
    function applyTheme(newTheme: Theme) {
        theme.value = newTheme
        localStorage.setItem('theme', newTheme)
        
        if (newTheme === 'system') {
            // 检查系统偏好
            isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        } else {
            isDarkMode.value = newTheme === 'dark'
        }
        
        // 应用主题到 HTML 元素
        if (isDarkMode.value) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }
    
    // 切换主题
    function toggleTheme() {
        const newTheme = isDarkMode.value ? 'light' : 'dark'
        applyTheme(newTheme)
    }
    
    // 设置特定主题
    function setTheme(newTheme: Theme) {
        applyTheme(newTheme)
    }
    
    // 初始应用主题
    applyTheme(theme.value)
    
    // 监听系统主题变化
    if (typeof window !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (theme.value === 'system') {
                isDarkMode.value = e.matches
                if (e.matches) {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
            }
        })
    }
    
    return {
        theme,
        isDarkMode,
        toggleTheme,
        setTheme
    }
})