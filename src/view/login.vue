<template>
    <div class="reliatve w-full h-full z-50">
        <div
            class="flex bg-[#eca292]/80 flex-col items-center justify-center absolute w-[35%] p-4 h-full rounded-r-2xl z-10">
            <!-- <h1>111</h1> -->
        </div>
        <div
            class="bg-[#e2dfd0]/10 p-4 flex flex-col justify-center items-center absolute h-full w-[70%] right-0">
            <!-- 卡片标题 -->
            <div class="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
                <h2 class="text-2xl font-bold text-center text-black mb-6">登录</h2>
                <!-- 表单内容 -->
                <form class="space-y-4 md:space-y-6 ">
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <label for="username" class="text-black font-medium w-full md:w-1/4">用户名</label>
                        <input type="text" id="username"
                            class="w-full md:w-3/4 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="请输入用户名">
                    </div>
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <label for="password" class="text-black font-medium w-full md:w-1/4">密码</label>
                        <input type="password" id="password"
                            class="w-full md:w-3/4 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-black placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="请输入密码">
                    </div>
                    <!-- 记住我选项 -->
                    <div class="flex items-center">
                        <input id="remember" type="checkbox" class="h-4 w-4 bg-white/20 border-white/30 rounded">
                        <label for="remember" class="ml-2 text-sm text-black">记住我</label>
                    </div>
                    <!-- 登录按钮 -->
                    <button type="submit"
                        class="w-full py-3 bg-[#7f8ca2] hover:bg-[#7f8ca2]/75 rounded-lg text-black font-medium transition-all duration-200 border border-white/30 backdrop-blur-sm">
                        登录
                    </button>
                    <!-- 其他选项 -->
                    <div class="text-center text-black text-sm">
                        <a href="#" class="hover:underline">忘记密码?</a> |
                        <a href="#" class="hover:underline">注册账号</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Button } from 'ant-design-vue';

</script>

<style scoped>
@import url('@/assets/css/login.css');
</style>