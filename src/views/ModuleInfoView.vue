<script setup lang="ts">
import type {AutoCompleteCompleteEvent, AutoCompleteItemSelectEvent} from 'primevue/autocomplete'
import AutoComplete from 'primevue/autocomplete'
import type {Ref} from 'vue'
import {ref, watch} from 'vue'
import type Repo from '@/model/Repo'
import type SelectableItem from '@/model/SelectableItem'
import type PersistedSelectedRepo from '@/model/PersistedSelectedRepo'
import type PhasedPlan from '@/model/PhasedPlan'
import InputSwitch from 'primevue/inputswitch'
import Panel from 'primevue/panel'
import Tag from 'primevue/tag'

import SelectedRepoItem from '@/components/SelectedRepoItem.vue'
import GraphRepoItem from '@/components/GraphRepoItem.vue'
import {useReposStore} from '@/stores/repos'
import {usePreferencesStore} from '@/stores/preferences'
import {createBuildPlan} from '@/service/BuildGraph'
import ModuleInfo from "@/components/ModuleInfo.vue";
import type Module from "@/model/Module";


const autoComplete = ref('')
const selectedModule: Ref<Module | null> = ref(null)

const reposStore = useReposStore()

const autoCompleteItems: Ref<SelectableItem[]> = ref([])

const autoCompleteSearch = (event: AutoCompleteCompleteEvent) => {
  autoCompleteItems.value = [
    ...reposStore.selectableItems
        .filter((item) => item.itemType !== 'REP')
        .filter((item) => item.name.includes(event.query))
  ]
}

const autoCompleteSelect = (event: AutoCompleteItemSelectEvent) => {
  const repo = reposStore.getRepoByName(event.value.repo)!;
  selectedModule.value = repo.modules.find((module) => module.name === event.value.name) ?? null
}

const onClear = () => {
  autoComplete.value = ''
  selectedModule.value = null
}

const getTagClass = (item: SelectableItem) => {
  switch (item.componentType) {
    case 'LIB':
      return 'tag-lib'
    case 'APP':
      return 'tag-app'
    case 'MIX':
      return 'tag-mix'
    default:
      return ''
  }
}
</script>

<template>
  <div>
    <span class="mt-4 p-float-label">
      <AutoComplete
          inputId="ac"
          v-model="autoComplete"
          :suggestions="autoCompleteItems"
          optionLabel="name"
          :dropdown="true"
          @complete="autoCompleteSearch"
          @item-select="autoCompleteSelect"
          forceSelection
      >
        <template #option="slotProps">
          <div>
            <Tag :class="getTagClass(slotProps.option)"
            ><p class="mono">{{ slotProps.option.itemType }}</p></Tag
            >
            {{ slotProps.option.name }}
          </div>
        </template>
      </AutoComplete>
      <label for="ac">Select module</label>
    </span>
    <Panel class="mt-2" header="Module info">
      <template #icons>
        <button class="p-panel-header-icon mr-2" @click="onClear">
          <span class="pi pi-trash"></span>
        </button>
      </template>
      <ModuleInfo v-if="selectedModule" :module="selectedModule"/>
    </Panel>

  </div>
</template>

<style scoped>
.mono {
  font-family: monospace;
}

.tag-lib {
  background: var(--yellow-500);
  color: #fff;
}

.tag-app {
  background: var(--cyan-500);
  color: #fff;
}

.tag-mix {
  background: linear-gradient(to right, var(--yellow-500), var(--cyan-500));
  color: #fff;
}
</style>
