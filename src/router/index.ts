import { createRouter, createWebHistory } from 'vue-router'
import MainManager from '../view/mainManager.vue'
import { useAuthStore } from '@/stores/auth'
import login from '@/view/login.vue'


const routes = [
    {
        path: '/',
        name: 'main',
        component: MainManager,
        beforeEnter(to: any, from: any, next: any) {
            const authStore = useAuthStore()
            if (authStore.isAuthenticated) {
                next()
            } else {
                next({ path: '/login' })
            }
        }
    },
    {
        path: '/login',
        name: 'login',
        component: login
    }
]

const router = createRouter({
    history: createWebHistory('/admin'),
    routes
})

export default router