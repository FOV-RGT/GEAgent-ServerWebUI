import { defineStore } from 'pinia'
import { h, ref, computed } from 'vue'
import { toast } from 'vue-sonner'

export const useSystemStore = defineStore('system', ()=> {
    const sidebarOpen = ref(true)

    return {
        sidebarOpen
    }
})