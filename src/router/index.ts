import { createRouter, createWebHistory } from 'vue-router'
import MainManager from '../view/mainManager.vue'
import login from '@/view/login.vue'
import { useAuthStore } from '@/stores/auth'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'


const routes = [
    {
        path: '/',
        redirect: '/login',
        name: 'login'
    },
    {
        path: '/main',
        name: 'main',
        component: MainManager,
        beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
            const authStore = useAuthStore()
            if (authStore.isAuthenticated) {
                next()
            }else {
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