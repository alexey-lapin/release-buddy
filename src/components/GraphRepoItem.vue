<script setup lang="ts">
import type Repo from '@/model/Repo'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import { BUILD_BASE_URL, SOURCE_BASE_URL } from '@/service/Env'
import ModuleItem from '@/components/ModuleItem.vue'
import {ref, watch} from 'vue'
import { usePreferencesStore } from '@/stores/preferences'

const props = defineProps<{
  repo: Repo
}>()

const preferencesStore = usePreferencesStore()

const checked = ref(preferencesStore.isRepoMarked(props.repo.repoName))

watch(checked, (newValue) => {
  if (newValue) {
    preferencesStore.markRepo(props.repo.repoName)
  } else {
    preferencesStore.unmarkRepo(props.repo.repoName)
  }
})

const calculateClass = () => {
  if (checked.value) {
    return 'line-through text-500'
  }
  return ''
}
</script>

<template>
  <Card class="border-1">
    <template #title>
      <div class="flex">
        <div class="flex-grow-1 flex align-items-center gap-1">
          <Checkbox v-model="checked" :binary="true" />
          <span :class="calculateClass()">{{ props.repo.repoName }}</span>
        </div>
      </div>
    </template>
    <template #subtitle>
      <div class="flex gap-1">
        <a :href="`${SOURCE_BASE_URL}/${props.repo.repoName}`" target="_blank">
          <Button link label="source" icon="1pi 1pi-arrow-up-right" iconPos="right" class="p-0" />
        </a>
        <a :href="`${BUILD_BASE_URL}/${props.repo.repoName}`" target="_blank">
          <Button link label="build" icon="1pi 1pi-arrow-up-right" iconPos="right" class="p-0" />
        </a>
      </div>
    </template>
    <template #content>
      <div class="flex flex-wrap gap-2">
        <div v-for="module in props.repo.modules" :key="module.name">
          <ModuleItem :module="module" />
        </div>
      </div>
    </template>
  </Card>
</template>
