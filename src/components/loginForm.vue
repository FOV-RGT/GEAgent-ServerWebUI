<template>
    <form @submit="onSubmit" class="w-full space-y-6">
        <FormField v-slot="{ componentField }" name="username">
            <FormItem class="mountedAnimation">
                <FormLabel class="select-none">用户名</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="请输入用户名" v-bind="componentField" />
                </FormControl>
                <FormDescription class="select-none">
                    请输入您的账户用户名
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
            <FormItem class="mountedAnimation">
                <FormLabel class="select-none">密码</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="请输入密码" v-bind="componentField" />
                </FormControl>
                <FormDescription class="select-none">
                    请输入您的账户密码
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>
        <Button type="submit" class="w-full mountedAnimation" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
        </Button>
        <Button type="button" variant="outline" class="mt-4" @click="testToast">
            测试 Toast
        </Button>
    </Form>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as z from 'zod'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

const formSchema = toTypedSchema(z.object({
    username: z.string().min(1, "用户名不能为空"),
    password: z.string().min(1, "密码不能为空")
}))

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        username: '',
        password: ''
    }
})

function testToast() {
    toast('标题', {
        description: '描述文本',
        icon: h('span', { class: 'text-red-500' }, '🔥'),
        action: {
            label: '确定',
            onClick: () => console.log('点击了确定')
        }
    });
}

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

const onSubmit = form.handleSubmit(async (values) => {
    loading.value = true
    systemStore.animationId = 'waitLogin'
    try {
        const success = await authStore.login({
            username: values.username,
            password: values.password
        })
        // if (success) {
        //     router.push('/main')
        // }
    } catch (error) {
        toast.error('登录失败', {
            description: '发生了一个错误，请稍后再试',
        })
    } finally {
        loading.value = false
    }
})
</script>