<script setup lang="ts">
import type Repo from '@/model/Repo'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { BUILD_BASE_URL, SOURCE_BASE_URL } from '@/service/Env'
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
    <template #subtitle>
      <div class="flex gap-1">
        <a :href="`${SOURCE_BASE_URL}/${props.item.repoName}`" target="_blank">
          <Button link label="source" icon="1pi 1pi-arrow-up-right" iconPos="right" class="p-0" />
        </a>
        <a :href="`${BUILD_BASE_URL}/${props.item.repoName}`" target="_blank">
          <Button link label="build" icon="1pi 1pi-arrow-up-right" iconPos="right" class="p-0" />
        </a>
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
