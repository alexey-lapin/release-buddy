<script setup lang="ts">
import type Repo from '@/model/Repo'
import type Module from '@/model/Module'
import type { Ref } from 'vue'
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import { BUILD_BASE_URL, SOURCE_BASE_URL } from '@/service/Env'
import ModuleInfo from '@/components/ModuleInfo.vue'

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

const getModuleClass = (module: Module) => {
  if (module.type === 'APP') {
    return ['module-app']
  }
  if (module.type === 'LIB') {
    return ['module-lib']
  }
}
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
        <a :href="`${SOURCE_BASE_URL}/${props.item.repoName}`" target="_blank">source</a>
        <a :href="`${BUILD_BASE_URL}/${props.item.repoName}`" target="_blank">build</a>
      </div>
    </template>
    <template #content>
      <div class="flex flex-wrap gap-2">
        <div v-for="module in props.item.modules" :key="module.name">
          <div class="p-2 border-round" :class="getModuleClass(module)" @click="showModal(module)">
            {{ module.name }}
          </div>
        </div>
      </div>
    </template>
  </Card>
  <Dialog
    v-model:visible="modalVisible"
    modal
    :dismissableMask="true"
    header="Module info"
    :style="{ width: '50vw' }"
  >
    <ModuleInfo :module="modalModule" />
  </Dialog>
</template>

<style scoped>
.module-lib {
  border: 3px solid var(--yellow-500);
  cursor: pointer;
}

.module-lib:hover {
  background: var(--yellow-200);
}

.module-app {
  border: 3px solid var(--cyan-500);
  cursor: pointer;
}

.module-app:hover {
  background: var(--cyan-200);
}
</style>
