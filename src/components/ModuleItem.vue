<script setup lang="ts">
import ModuleInfo from '@/components/ModuleInfo.vue'
import Dialog from 'primevue/dialog'
import type Module from '@/model/Module'
import type { Ref } from 'vue'
import { ref } from 'vue'

const props = defineProps<{
  module: Module
}>()

const modalVisible = ref(false)
const modalModule: Ref<Module | null> = ref(null)

const getModuleClass = (module: Module) => {
  if (module.type === 'APP') {
    return ['module-app']
  }
  if (module.type === 'LIB') {
    return ['module-lib']
  }
}

const showModal = (module: Module) => {
  modalVisible.value = true
  modalModule.value = module
}
</script>

<template>
  <div
    class="p-2 border-round"
    :class="getModuleClass(props.module)"
    @click="showModal(props.module)"
  >
    {{ props.module.name }}
  </div>
  <Dialog
    v-model:visible="modalVisible"
    modal
    :dismissableMask="true"
    header="Module info"
    :style="{ width: '50vw' }"
  >
    <ModuleInfo :module="props.module" />
  </Dialog>
</template>

<style scoped>
.module-lib {
  border: 2px solid var(--rb-c-lib);
  cursor: pointer;
}

.module-lib:hover {
  background: var(--rb-c-lib-fade);
}

.module-app {
  border: 2px solid var(--rb-c-app);
  cursor: pointer;
}

.module-app:hover {
  background: var(--rb-c-app-fade);
}
</style>
