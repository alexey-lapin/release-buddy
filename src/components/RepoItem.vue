<script setup lang="ts">
import type Repo from '@/model/Repo'

const props = defineProps<{
  item: Repo
}>()
const emit = defineEmits<{
  delete: [name: string]
}>()
</script>

<template>
  <div class="p-2 border-2 border-primary-500">
    <div class="flex">
      <div class="flex gap-1 flex-grow-1">
        <p>{{ props.item.name }}</p>
        <a href="">source</a>
        <a href="">build</a>
      </div>
      <button class="p-link ml-1" @click="emit('delete', props.item.name)">
        <span class="pi pi-times"></span>
      </button>
    </div>
    <div class="mt-2 flex flex-wrap gap-2">
      <div v-for="module in props.item.modules" :key="module">
        <span class="p-1 border-1 border-primary-500">{{ module.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
