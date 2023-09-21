<script setup lang="ts">
import type Repo from '@/model/Repo'
import Button from 'primevue/button'
import Card from 'primevue/card'
import ModuleItem from '@/components/ModuleItem.vue'

const props = defineProps<{
  item: Repo
  isDeletable: boolean
}>()
const emit = defineEmits<{
  delete: [name: string]
}>()
</script>

<template>
  <Card class="border-1">
    <template #title>
      <div class="flex">
        <span class="flex-grow-1">{{ props.item.repoName }}</span>
        <button
          v-if="props.isDeletable"
          class="p-link ml-2"
          @click="emit('delete', props.item.repoName)"
        >
          <span class="pi pi-times"></span>
        </button>
      </div>
    </template>
    <template #content>
      <div class="flex flex-wrap gap-2">
        <div v-for="module in props.item.modules" :key="module.name">
          <ModuleItem :module="module" />
        </div>
      </div>
    </template>
  </Card>
</template>