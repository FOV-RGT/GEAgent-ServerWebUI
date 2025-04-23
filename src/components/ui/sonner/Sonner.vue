<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :toast-options="{
      classes: {
        toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        title: 'group-[.toast]:text-lg group-[.toast]:font-medium', // 增加标题大小
        description: 'group-[.toast]:text-base group-[.toast]:text-muted-foreground', // 增加描述文本大小
        actionButton:
          'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton:
          'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      },
    }"
  />
</template>
