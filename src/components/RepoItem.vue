<script setup lang="ts">
import type Repo from '@/model/Repo'

const props = defineProps<{
  item: Repo
}>()
</script>

<template>
  <div class="p-2 border-2 border-primary-500">
    <p>{{ props.item.name }}</p>
    <div class="flex flex-wrap gap-2">
      <div v-for="module in props.item.modules" :key="module">
        <span class="p-1 border-1 border-primary-500">{{ module.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
