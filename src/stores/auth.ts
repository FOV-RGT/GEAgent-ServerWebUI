import { defineStore } from 'pinia'
import { h, ref, computed } from 'vue'
import { UserLogin, User, LoginRes } from '@/types/auth'
import api from '@/api/index'
import { toast } from 'vue-sonner'

export const useAuthStore = defineStore('auth', () => {
    // 状态
    const token = ref<string>(localStorage.getItem('token') || '')
    const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || '{}'))

    // 计算属性
    const isAuthenticated = computed<Boolean>(() => !!token.value)
    const userRole = computed<string>(() => user.value?.role || '')
    const isAdmin = computed<Boolean>(() => userRole.value === 'admin')

    function setToken(newToken: string): void {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    function setUser(userData: User): void {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function clearAuth(): void {
        token.value = ''
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    async function login(userLogin: UserLogin): Promise<Boolean> {
        try {
            const res = await api.post<LoginRes>('/user/login', userLogin)
            console.log('Login response:', res.data);
            const { token, message, user } = res.data
            if (user.role !== 'admin') {
                toast.error('登录失败', {
                    description: '非管理员用户无法登录',
                })
                return false
            }
            setToken(token);
            setUser(user);
            toast.success('登录成功', {
                description: message,
            })
            return true
        } catch (err) {
            toast.error('登录失败', {
                description: `${err.data.message}`,
            })
            return false
        }
    }


    async function logout() {
        clearAuth()
        return { success: true }
    }

    return {
        token,
        user,
        isAuthenticated,
        userRole,
        setToken,
        setUser,
        clearAuth,
        login,
        logout,
        isAdmin
    }
})