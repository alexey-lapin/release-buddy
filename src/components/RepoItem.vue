<script setup lang="ts">
import type Repo from '@/model/Repo'
import Card from 'primevue/card'

const props = defineProps<{
  item: Repo
  isDeletable: boolean
}>()
const emit = defineEmits<{
  delete: [name: string]
}>()
</script>

<template>
  <!--  <div class="p-2 border-primary-500 hover:border-primary-700 border-3 border-round">-->
  <!--    <div class="flex">-->
  <!--      <div class="flex gap-1 flex-grow-1">-->
  <!--        <p>{{ props.item.name }}</p>-->
  <!--        <a href="">source</a>-->
  <!--        <a href="">build</a>-->
  <!--      </div>-->
  <!--      <button class="p-link ml-1" @click="emit('delete', props.item.name)">-->
  <!--        <span class="pi pi-times"></span>-->
  <!--      </button>-->
  <!--    </div>-->
  <!--    <div class="mt-2 flex flex-wrap gap-2">-->
  <!--      <div v-for="module in props.item.modules" :key="module">-->
  <!--        <span class="p-1 border-1 border-primary-500">{{ module.name }}</span>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <Card class="border-1">
    <template #title>
      <div class="flex">
        <span class="flex-grow-1">{{ props.item.repoName }}</span>
        <button v-if="props.isDeletable" class="p-link ml-2" @click="emit('delete', props.item.repoName)">
          <span class="pi pi-times"></span>
        </button>
      </div>
    </template>
    <template #subtitle>
      <div class="flex gap-1">
        <a href="">source</a>
        <a href="">build</a>
      </div>
    </template>
    <template #content>
      <div class="flex flex-wrap gap-2">
        <div v-for="module in props.item.modules" :key="module.name">
          <span class="p-2 surface-200 hover:surface-300 border-800 border-round surface-border">{{ module.name }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
