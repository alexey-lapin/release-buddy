<script setup lang="ts">
import type { AutoCompleteCompleteEvent, AutoCompleteItemSelectEvent } from 'primevue/autocomplete'
import AutoComplete from 'primevue/autocomplete'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type SelectableItem from '@/model/SelectableItem'
import Panel from 'primevue/panel'
import { useReposStore } from '@/stores/repos'
import ModuleInfo from '@/components/ModuleInfo.vue'
import type Module from '@/model/Module'
import ItemTypeTag from '@/components/ItemTypeTag.vue'

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
  const repo = reposStore.getRepoByName(event.value.repo)!
  selectedModule.value = repo.modules.find((module) => module.name === event.value.name) ?? null
}

const onClear = () => {
  autoComplete.value = ''
  selectedModule.value = null
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
            <ItemTypeTag
              :type="slotProps.option.componentType"
              :label="slotProps.option.itemType"
            />
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
      <ModuleInfo v-if="selectedModule" :module="selectedModule" />
    </Panel>
  </div>
</template>
