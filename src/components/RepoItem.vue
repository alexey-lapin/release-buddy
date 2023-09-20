<script setup lang="ts">
import type Repo from '@/model/Repo'
import type Module from "@/model/Module";
import type {Ref} from 'vue'
import {ref} from "vue";
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'

const props = defineProps<{
  item: Repo
  isDeletable: boolean
}>()
const emit = defineEmits<{
  delete: [name: string]
}>()

const modalVisible = ref(false)
const modalModule: Ref<Module | null> = ref(null)
const showModal = (module: Module) => {
  modalVisible.value = true
  modalModule.value = module
}
</script>

<template>
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
          <div class="p-2 surface-200 hover:surface-300 border-800 border-round surface-border"
               @click="showModal(module)">{{
              module.name
            }}
          </div>
        </div>
      </div>
    </template>
  </Card>
  <Dialog v-model:visible="modalVisible" modal :dismissableMask="true" header="Module info" :style="{ width: '50vw' }">
    <p>
      <span class="font-bold">Name:</span> {{ modalModule?.name }}
    </p>
    <p>
      <span class="font-bold">Type:</span>  {{ modalModule?.type }}
    </p>
    <p>
      <span class="font-bold">Is Root:</span>  {{ modalModule?.isRoot }}
    </p>
    <p>
      <span class="font-bold">Template:</span>  {{ modalModule?.template }}
    </p>
    <p>
      <span class="font-bold">Main:</span>  {{ modalModule?.main }}
    </p>
    <p>
      <span class="font-bold">Image Type:</span>  {{ modalModule?.imageType }}
    </p>
    <p>
      <span class="font-bold">Dependencies:</span>
    </p>
    <ul>
      <li v-for="dep in modalModule?.dependencies" :key="dep">{{ dep }}</li>
    </ul>
  </Dialog>
</template>

<style scoped></style>
