import { ref, reactive } from 'vue'

export type ResourceType = 'image' | 'font' | 'video' | 'audio' | 'other'

export interface Resource {
    id: string
    type: ResourceType
    url: string
    loaded: boolean
    element?: HTMLElement | null
}

export class Preloader {
    resources = reactive<Resource[]>([])
    progress = ref(0)
    loaded = ref(false)
    errors = ref<string[]>([])

    // 添加资源
    addResource(id: string, url: string, type: ResourceType = 'image') {
        this.resources.push({ id, url, type, loaded: false })
        return this
    }

    // 添加多个资源
    addResources(resources: Array<{ id: string, url: string, type?: ResourceType }>) {
        resources.forEach(resource => {
            this.addResource(resource.id, resource.url, resource.type || 'image')
        })
        return this
    }

    // 加载所有资源
    async loadAll(): Promise<void> {
        if (this.resources.length === 0) {
            this.loaded.value = true
            this.progress.value = 100
            return
        }

        const promises = this.resources.map(resource => this.loadResource(resource))

        // 并发加载所有资源
        await Promise.allSettled(promises)

        this.loaded.value = true
        this.progress.value = 100
    }

    // 加载单个资源
    private async loadResource(resource: Resource): Promise<void> {
        try {
            if (resource.type === 'image') {
                await this.loadImage(resource)
            } else if (resource.type === 'font') {
                await this.loadFont(resource)
            }

            resource.loaded = true
            this.updateProgress()
        } catch (error) {
            this.errors.value.push(`Failed to load resource ${resource.id}: ${error}`)
            console.error(`Error loading resource ${resource.id}:`, error)
        }
    }

    // 加载图片
    private loadImage(resource: Resource): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                resource.element = img
                resolve()
            }
            img.onerror = () => reject(new Error(`Failed to load image: ${resource.url}`))
            img.src = resource.url
        })
    }

    // 加载字体
    private loadFont(resource: Resource): Promise<void> {
        return new Promise((resolve, reject) => {
            // 使用FontFace API 加载字体
            const font = new FontFace(resource.id, `url(${resource.url})`)
            font.load()
                .then(loadedFont => {
                    // 使用类型断言解决TypeScript错误
                    (document.fonts as any).add(loadedFont)
                    resolve()
                })
                .catch(error => reject(error))
        })
    }

    // 更新加载进度
    private updateProgress() {
        const totalResources = this.resources.length
        const loadedResources = this.resources.filter(r => r.loaded).length
        this.progress.value = Math.floor((loadedResources / totalResources) * 100)
    }
}

// 创建一个单例预加载器
export const preloader = new Preloader()