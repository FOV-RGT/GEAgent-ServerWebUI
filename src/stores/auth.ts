import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UserLogin, User, LoginRes } from '@/types/auth'
import api from '@/api/index'

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
            const { token, message, user } = res.data
            setToken(token);
            setUser(user);
            console.log('Login success:', message);
            return true
        } catch (err) {
            console.log('Login error:', err);
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